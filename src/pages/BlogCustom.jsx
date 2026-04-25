import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { deleteBlog as deleteBlogApi, getBlogById } from '../utils/blogsApi';
import '../components/blog.css';

const categoryColors = {
  Focus: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
  'Time Management': 'bg-cyan-100 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-400',
  Organization: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400',
  Goals: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
  Habits: 'bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-400',
  Energy: 'bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400',
};

const slugify = (value) => {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const buildSections = (content) => {
  const normalized = String(content || '').trim();
  if (!normalized) {
    return { sections: [], hasToc: false };
  }

  const lines = normalized.split(/\r?\n/);
  const hasMarkdownHeadings = lines.some((line) => /^#{1,3}\s+\S+/.test(line.trim()));

  if (hasMarkdownHeadings) {
    const sections = [];
    let current = null;

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      const headingMatch = trimmedLine.match(/^#{1,3}\s+(.*)$/);

      if (headingMatch) {
        if (current && current.body.trim()) {
          sections.push(current);
        }

        current = {
          title: headingMatch[1].trim(),
          body: '',
        };
        return;
      }

      if (!current) {
        current = { title: 'Introduction', body: '' };
      }

      current.body += `${line}\n`;
    });

    if (current && current.body.trim()) {
      sections.push(current);
    }

    const seenIds = new Set();
    const normalizedSections = sections.map((section, index) => {
      const baseId = slugify(section.title) || `section-${index + 1}`;
      let id = baseId;
      let suffix = 1;

      while (seenIds.has(id)) {
        id = `${baseId}-${suffix}`;
        suffix += 1;
      }

      seenIds.add(id);
      return {
        ...section,
        id,
        body: section.body.trim(),
      };
    });

    return {
      sections: normalizedSections,
      hasToc: normalizedSections.length > 0,
    };
  }

  return {
    sections: [
      {
        id: 'full-article',
        title: 'Full Article',
        body: normalized,
      },
    ],
    hasToc: false,
  };
};

const splitParagraphs = (textBlock) => {
  return String(textBlock || '')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
};

const getAuthorInitials = (name) => {
  const value = String(name || '').trim();
  if (!value) return 'FM';

  const parts = value.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
};

const BlogCustom = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteError, setDeleteError] = useState('');
  const [activeTocId, setActiveTocId] = useState('');

  const { sections: contentSections, hasToc } = useMemo(() => {
    return buildSections(blog?.content);
  }, [blog?.content]);

  useEffect(() => {
    if (!hasToc || contentSections.length === 0) {
      setActiveTocId('');
      return;
    }

    setActiveTocId(contentSections[0].id);

    const sectionElements = contentSections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean);

    if (sectionElements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveTocId(visibleEntries[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    sectionElements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [contentSections, hasToc]);

  useEffect(() => {
    if (!hasToc || !activeTocId) {
      return;
    }

    const indicator = document.querySelector('nav .toc-indicator');
    const activeLink = document.querySelector(`a[href="#${activeTocId}"]`);

    if (!indicator || !activeLink) {
      return;
    }

    indicator.style.height = `${activeLink.offsetHeight}px`;
    indicator.style.transform = `translateY(${activeLink.offsetTop}px)`;
  }, [activeTocId, hasToc]);

  useEffect(() => {
    let active = true;

    const loadBlog = async () => {
      try {
        setLoading(true);
        const data = await getBlogById(blogId);
        if (active) {
          setBlog(data);
        }
      } catch {
        if (active) {
          setBlog(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadBlog();

    return () => {
      active = false;
    };
  }, [blogId]);

  const handleDelete = () => {
    const confirmed = window.confirm('Delete this blog post? This cannot be undone.');
    if (!confirmed) return;

    deleteBlogApi(blogId)
      .then(() => navigate('/blog'))
      .catch((error) => {
        setDeleteError(error?.response?.data?.message || error.message || 'Unable to delete this blog right now. Please try again.');
      });
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-16">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
          <p className="text-gray-600 dark:text-gray-300">Loading blog...</p>
        </div>
      </section>
    );
  }

  if (!blog) {
    return (
      <section className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center shadow-xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900 px-4 py-2 text-sm font-semibold mb-4 text-blue-700 dark:text-blue-200">
            Community Blog
          </div>
          <h1 className="text-3xl font-black mb-4 text-gray-900 dark:text-white">Blog not found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            This post may have been removed or the page was opened on a device that does not have the saved blog yet.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            Back to Blogs
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-24 sm:pt-28 pb-8 sm:pb-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6">
        <Link to="/blog" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blogs
        </Link>

        <article className="max-w-7xl mx-auto">
          <div className="mt-4 text-center mb-8 sm:mb-12">
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full">
                Community
              </span>
              <span className={`${categoryColors[blog.category] || categoryColors.Focus} text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full`}>
                {blog.category || 'Focus'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight px-4 sm:px-0">
              {blog.title}
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 font-light px-4 sm:px-0 max-w-4xl mx-auto">
              {blog.excerpt}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-[0_0_0_4px_rgba(59,130,246,0.15)]">
                  <span className="text-white font-bold text-sm sm:text-base">{getAuthorInitials(blog.authorName)}</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{blog.authorName || 'Focusora Member'}</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Community Author</div>
                </div>
              </div>

              <div className="hidden sm:block text-gray-400 dark:text-gray-500">-</div>

              <div className="flex items-center space-x-4 sm:space-x-6">
                <div className="text-gray-600 dark:text-gray-400 text-center">
                  <div className="text-xs sm:text-sm uppercase tracking-wider">Published</div>
                  <div className="font-medium text-sm sm:text-base">{new Date(blog.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="text-gray-400 dark:text-gray-500">-</div>
                <div className="text-gray-600 dark:text-gray-400 text-center">
                  <div className="text-xs sm:text-sm uppercase tracking-wider">Read time</div>
                  <div className="font-medium text-sm sm:text-base">{blog.readTime || '1 min read'}</div>
                </div>
              </div>
            </div>

            <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl">
              <img src={blog.coverImage} alt={blog.title} className="w-full h-72 sm:h-[28rem] object-cover" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-12">
            {hasToc && (
              <aside className="lg:col-span-1 order-2 lg:order-1">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl p-4 sm:p-6 lg:sticky lg:top-24 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    Table of Contents
                  </h3>

                  <nav className="space-y-1 relative pl-4">
                    <div className="toc-indicator absolute left-0 top-0 h-9 w-1 rounded-full" />
                    {contentSections.map((section) => (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        className={`toc-link block py-2 px-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors text-xs sm:text-sm font-medium ${activeTocId === section.id ? 'active-toc' : ''}`}
                      >
                        {section.title}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}

            <article className={`${hasToc ? 'lg:col-span-3 order-1 lg:order-2' : 'lg:col-span-4'} bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700`}>
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 sm:p-12 text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Community Knowledge Drop</h2>
                <p className="text-blue-100 text-sm sm:text-base">Shared by Focusora members</p>
              </div>

              <div className="p-4 sm:p-8 md:p-12">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
                  <p className="text-sm text-gray-500 dark:text-gray-400">This is a community-created post.</p>
                  {user && String(blog.authorId) === String(user.uid) && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 transition-colors"
                    >
                      Delete Blog
                    </button>
                  )}
                </div>

                {deleteError && (
                  <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-300">
                    {deleteError}
                  </p>
                )}

                <div className="space-y-8">
                  {contentSections.map((section) => (
                    <section key={section.id} id={section.id} className="scroll-mt-24">
                      {hasToc && <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">{section.title}</h3>}

                      <div className="space-y-4">
                        {splitParagraphs(section.body).map((paragraph, index) => (
                          <p key={`${section.id}-paragraph-${index}`} className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </article>
      </div>
    </section>
  );
};

export default BlogCustom;
