import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAuthErrorMessage } from '../utils/authErrors';
import { createBlog as createBlogApi, defaultBlogCoverImage, deleteBlog as deleteBlogApi, listBlogs } from '../utils/blogsApi';

const MAX_COVER_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const BLOG_TITLE_MIN_LENGTH = 3;
const BLOG_TITLE_MAX_LENGTH = 140;
const BLOG_EXCERPT_MIN_LENGTH = 20;
const BLOG_EXCERPT_MAX_LENGTH = 500;
const BLOG_CONTENT_MIN_LENGTH = 50;
const BLOG_CONTENT_MAX_LENGTH = 20000;

const Blog = () => {
  const { user } = useAuth();
  const coverImageInputRef = useRef(null);

  const allArticles = [
    {
      id: 1,
      title: '7 Science-Backed Methods to Eliminate Distractions',
      category: 'Focus',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      readTime: '5 min read',
      description: 'Discover proven techniques to maintain laser focus in our hyper-connected world and boost your productivity by 300%.',
      link: '/blog1',
    },
    {
      id: 2,
      title: 'The 2-Minute Rule That Will Transform Your Day',
      category: 'Time Management',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      readTime: '8 min read',
      description: 'Learn how this simple principle can help you tackle procrastination and build momentum for your biggest goals.',
      link: '/blog2',
    },
    {
      id: 3,
      title: 'Inbox Zero: Master Email in 15 Minutes Daily',
      category: 'Organization',
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      readTime: '10 min read',
      description: 'A step-by-step system to conquer email overload and reclaim hours of productive time every week.',
      link: '/blog1',
    },
    {
      id: 4,
      title: 'From Overwhelmed to Organized: The Ultimate System',
      category: 'Goals',
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      readTime: '12 min read',
      description: 'Transform chaos into clarity with this proven framework for managing tasks, projects, and long-term goals.',
      link: '/blog2',
    },
    {
      id: 5,
      title: 'Morning Rituals of High Performers',
      category: 'Habits',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      readTime: '7 min read',
      description: 'Design the perfect morning routine to set yourself up for peak performance and achievement all day long.',
      link: '/blog1',
    },
    {
      id: 6,
      title: 'Energy Management: The Key to Sustainable Success',
      category: 'Energy',
      image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      readTime: '9 min read',
      description: 'Learn to work with your natural energy cycles and maintain peak performance without burning out.',
      link: '/blog2',
    },
    {
      id: 7,
      title: 'Building Resilience: Thriving Under Pressure',
      category: 'Focus',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      readTime: '11 min read',
      description: 'Develop mental toughness and learn strategies to perform at your best even in challenging situations.',
      link: '/blog1',
    },
    {
      id: 8,
      title: 'The Power of Saying No: Protect Your Focus',
      category: 'Time Management',
      image: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      readTime: '6 min read',
      description: 'Master the art of declining commitments that don\'t align with your goals and priorities.',
      link: '/blog2',
    },
    {
      id: 9,
      title: 'Creating Your Ideal Work Environment',
      category: 'Organization',
      image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      readTime: '9 min read',
      description: 'Design a workspace that enhances focus, creativity, and productivity throughout your day.',
      link: '/blog1',
    },
    {
      id: 10,
      title: 'Goal Setting Framework for 2025',
      category: 'Goals',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      readTime: '14 min read',
      description: 'Learn a proven system for setting and achieving ambitious goals that truly matter to you.',
      link: '/blog2',
    },
    {
      id: 11,
      title: 'Breaking Bad Habits: A Scientific Approach',
      category: 'Habits',
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      readTime: '10 min read',
      description: 'Understanding the neuroscience behind habits and practical steps to replace them with positive ones.',
      link: '/blog1',
    },
    {
      id: 12,
      title: 'Optimizing Your Sleep for Peak Performance',
      category: 'Energy',
      image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      readTime: '13 min read',
      description: 'Discover evidence-based strategies to improve sleep quality and wake up energized every morning.',
      link: '/blog2',
    },
  ];

  const [visibleCount, setVisibleCount] = useState(6);
  const [communityBlogs, setCommunityBlogs] = useState([]);
  const [communityLoading, setCommunityLoading] = useState(true);
  const [communityError, setCommunityError] = useState('');
  const [submitPending, setSubmitPending] = useState(false);
  const [deletePendingBlogId, setDeletePendingBlogId] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [isBlogModalOpen, setBlogModalOpen] = useState(false);
  const [blogForm, setBlogForm] = useState({
    authorName: '',
    authorEmail: '',
    title: '',
    category: 'Focus',
    excerpt: '',
    content: '',
    coverImage: '',
    coverImageFile: null,
  });

  const articles = allArticles.slice(0, visibleCount);

  const loadMoreArticles = () => {
    setVisibleCount(prev => Math.min(prev + 6, allArticles.length));
  };

  const categoryColors = {
    Focus: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
    'Time Management': 'bg-cyan-100 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-400',
    Organization: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400',
    Goals: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
    Habits: 'bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-400',
    Energy: 'bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400',
  };

  const loadCommunityBlogs = useCallback(async () => {
    setCommunityLoading(true);
    setCommunityError('');

    try {
      const data = await listBlogs(30);
      setCommunityBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      setCommunityError(error?.response?.data?.message || 'Unable to load community blogs right now.');
    } finally {
      setCommunityLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCommunityBlogs();
  }, [loadCommunityBlogs]);

  useEffect(() => {
    if (!isBlogModalOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setBlogModalOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isBlogModalOpen]);

  const openBlogModal = () => {
    setSubmitError('');
    setSubmitSuccess('');
    setBlogModalOpen(true);
  };

  const closeBlogModal = () => {
    setBlogModalOpen(false);
  };

  const handleCommunityInputChange = (event) => {
    const { name, value } = event.target;
    setBlogForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverImageFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;

    if (!selectedFile) {
      setBlogForm((prev) => ({ ...prev, coverImageFile: null }));
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      setSubmitError('Please choose a valid image file for cover upload.');
      event.target.value = '';
      return;
    }

    if (selectedFile.size > MAX_COVER_FILE_SIZE_BYTES) {
      setSubmitError('Cover image file must be 2MB or smaller.');
      event.target.value = '';
      return;
    }

    setSubmitError('');
    setBlogForm((prev) => ({ ...prev, coverImageFile: selectedFile }));
  };

  const clearSelectedCoverImageFile = () => {
    setBlogForm((prev) => ({ ...prev, coverImageFile: null }));
    if (coverImageInputRef.current) {
      coverImageInputRef.current.value = '';
    }
  };

  const handleCommunitySubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    const title = blogForm.title.trim();
    const excerpt = blogForm.excerpt.trim();
    const content = blogForm.content.trim();

    if (!title || !excerpt || !content) {
      setSubmitError('Title, excerpt, and content are required.');
      return;
    }

    if (title.length < BLOG_TITLE_MIN_LENGTH || title.length > BLOG_TITLE_MAX_LENGTH) {
      setSubmitError(`Title must be between ${BLOG_TITLE_MIN_LENGTH} and ${BLOG_TITLE_MAX_LENGTH} characters.`);
      return;
    }

    if (excerpt.length < BLOG_EXCERPT_MIN_LENGTH || excerpt.length > BLOG_EXCERPT_MAX_LENGTH) {
      setSubmitError(`Excerpt must be between ${BLOG_EXCERPT_MIN_LENGTH} and ${BLOG_EXCERPT_MAX_LENGTH} characters.`);
      return;
    }

    if (content.length < BLOG_CONTENT_MIN_LENGTH || content.length > BLOG_CONTENT_MAX_LENGTH) {
      setSubmitError(`Content must be between ${BLOG_CONTENT_MIN_LENGTH} and ${BLOG_CONTENT_MAX_LENGTH} characters.`);
      return;
    }

    if (!user && !blogForm.authorName.trim()) {
      setSubmitError('Please add your name to publish as a community member.');
      return;
    }

    const payload = {
      title,
      category: blogForm.category,
      excerpt,
      content,
      coverImage: blogForm.coverImage.trim(),
    };

    if (blogForm.coverImageFile) {
      payload.coverImageFile = blogForm.coverImageFile;
    }

    if (!user) {
      payload.authorName = blogForm.authorName.trim();
      payload.authorEmail = blogForm.authorEmail.trim();
    }

    setSubmitPending(true);

    try {
      const createdBlog = await createBlogApi(payload);
      setCommunityBlogs((prev) => [createdBlog, ...prev]);
      setSubmitSuccess('Your blog is now published in the community section.');
      setBlogModalOpen(false);
      setBlogForm((prev) => ({
        ...prev,
        title: '',
        category: 'Focus',
        excerpt: '',
        content: '',
        coverImage: '',
        coverImageFile: null,
      }));
      if (coverImageInputRef.current) {
        coverImageInputRef.current.value = '';
      }
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error, 'Unable to publish your blog right now.'));
    } finally {
      setSubmitPending(false);
    }
  };

  const formatBlogDate = (dateValue) => {
    if (!dateValue) {
      return 'Recently posted';
    }

    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) {
      return 'Recently posted';
    }

    return parsedDate.toLocaleDateString();
  };

  const handleDeleteCommunityBlog = async (blogId) => {
    const confirmed = window.confirm('Delete this blog post? This cannot be undone.');
    if (!confirmed) return;

    setDeletePendingBlogId(String(blogId));
    setSubmitError('');
    setSubmitSuccess('');

    try {
      await deleteBlogApi(blogId);
      setCommunityBlogs((prev) => prev.filter((blog) => String(blog.id || blog._id) !== String(blogId)));
      setSubmitSuccess('Blog deleted successfully.');
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error, 'Unable to delete this blog right now.'));
    } finally {
      setDeletePendingBlogId('');
    }
  };

  return (
    <>

      {}
      <section className="bg-gradient-to-r from-indigo-300 to-cyan-100 dark:from-gray-900 dark:to-gray-800 pt-20 pb-16 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 text-left lg:pr-12">
              <h1 className="text-6xl lg:text-7xl font-extrabold text-blue-900 dark:text-white mb-6">
                Productivity Blog
              </h1>
              <p className="text-2xl lg:text-3xl text-blue-800 dark:text-gray-300 font-medium mb-8">
                Focus. Study. Thrive.
              </p>
              <p className="text-blue-700 dark:text-gray-400 text-lg mb-8">
                Your ultimate resource for productivity insights, focus strategies, and actionable tips to transform your work and life.
              </p>
              <a
                href="#latest-articles"
                className="inline-flex items-center bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 transform"
              >
                Explore Articles
              </a>
            </div>
            <div className="lg:w-1/2 flex justify-center lg:justify-end mt-8 lg:mt-0">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="Productive workspace with laptop and notebook"
                  className="w-96 h-96 object-cover rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section id="featured" className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Article
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Our most impactful productivity insights
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="group bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800 rounded-3xl overflow-hidden shadow-lg dark:shadow-xl hover:shadow-2xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="md:flex h-full">
                {}
                <div className="md:w-1/2 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    alt="Deep work and focus strategies"
                    className="w-full h-64 md:h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
                  <Link to="/blog1" className="block h-full">
                    <div className="inline-block bg-blue-700 dark:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide mb-4 group-hover:bg-blue-800 dark:group-hover:bg-blue-700 transition-colors duration-300">
                      Featured
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      The Ultimate Guide to Deep Work: Transform Your Productivity in 30 Days
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                      Master the art of sustained focus with proven strategies from top performers. Learn how to eliminate distractions, create optimal work environments, and achieve breakthrough results.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                        15 min read • Dec 2024
                      </span>
                      <span className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 transform group-hover:shadow-lg">
                        Read Article
                        <svg
                          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-gray-50 dark:bg-gray-900" id="latest-articles">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Latest Articles
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Fresh insights to supercharge your productivity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <Link to={article.link}>
                  <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`${categoryColors[article.category]} px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide`}
                      >
                        {article.category}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{article.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      {article.description}
                    </p>
                    <span className="inline-flex items-center text-blue-700 dark:text-blue-400 font-semibold hover:underline">
                      Read More
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {}
          {visibleCount < allArticles.length && (
            <div className="text-center mt-12">
              <button 
                onClick={loadMoreArticles}
                className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 transform shadow-lg"
              >
                Load More Articles
              </button>
            </div>
          )}
        </div>
      </section>

      {}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-slate-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Community Blogs
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Stories and productivity systems shared by Focusora members.
            </p>

            <div className="mt-6">
              <button
                type="button"
                onClick={openBlogModal}
                className="inline-flex items-center rounded-full bg-blue-700 px-7 py-3 text-white font-semibold hover:bg-blue-800 transition-colors"
              >
                Add your blog
              </button>
            </div>
          </div>

          {communityLoading && (
            <div className="flex items-center justify-center py-14">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                <p className="mt-4 text-gray-600 dark:text-gray-300">Loading community blogs...</p>
              </div>
            </div>
          )}

          {!communityLoading && communityError && (
            <div className="max-w-2xl mx-auto rounded-2xl border border-red-200 bg-red-50 dark:border-red-500/40 dark:bg-red-950/40 p-6 text-center">
              <p className="text-red-700 dark:text-red-300 font-medium mb-4">{communityError}</p>
              <button
                type="button"
                onClick={loadCommunityBlogs}
                className="inline-flex items-center rounded-full bg-blue-700 px-6 py-2 text-white font-semibold hover:bg-blue-800 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {!communityLoading && !communityError && communityBlogs.length === 0 && (
            <div className="max-w-3xl mx-auto rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Be the first community author</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Publish your first article below and it will appear here instantly.
              </p>
              <button
                type="button"
                onClick={openBlogModal}
                className="inline-flex items-center rounded-full bg-blue-700 px-7 py-3 text-white font-semibold hover:bg-blue-800 transition-colors"
              >
                Write Your Blog
              </button>
            </div>
          )}

          {!communityLoading && !communityError && communityBlogs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {communityBlogs.slice(0, 9).map((communityBlog) => (
                <article
                  key={communityBlog.id || communityBlog._id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <Link to={`/blog/community/${communityBlog.id || communityBlog._id}`}>
                    <img
                      src={communityBlog.coverImage || defaultBlogCoverImage}
                      alt={communityBlog.title}
                      className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="p-6">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className={`${categoryColors[communityBlog.category] || categoryColors.Focus} px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide`}>
                          {communityBlog.category || 'Focus'}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{communityBlog.readTime || '1 min read'}</span>
                      </div>

                      <h3 className="mb-2 text-xl font-bold leading-tight text-gray-900 transition-colors duration-300 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400">
                        {communityBlog.title}
                      </h3>

                      <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                        {communityBlog.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>By {communityBlog.authorName || 'Focusora Member'}</span>
                        <span>{formatBlogDate(communityBlog.createdAt)}</span>
                      </div>
                    </div>
                  </Link>

                  {user && String(communityBlog.authorId) === String(user.uid) && (
                    <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleDeleteCommunityBlog(communityBlog.id || communityBlog._id)}
                        disabled={deletePendingBlogId === String(communityBlog.id || communityBlog._id)}
                        className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletePendingBlogId === String(communityBlog.id || communityBlog._id) ? 'Deleting...' : 'Delete My Blog'}
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {isBlogModalOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            aria-label="Close add blog popup"
            onClick={closeBlogModal}
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-blog-heading"
            className="relative w-full max-w-4xl rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 max-h-[90vh] overflow-y-auto p-8 sm:p-10"
          >
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <h2 id="add-blog-heading" className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
                  Add Your Own Blog
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Keep the Focusora community growing by sharing your best productivity ideas.
                </p>
              </div>
              <button
                type="button"
                onClick={closeBlogModal}
                className="rounded-md px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleCommunitySubmit}>
              {!user && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="authorName">
                      Your Name
                    </label>
                    <input
                      id="authorName"
                      name="authorName"
                      type="text"
                      value={blogForm.authorName}
                      onChange={handleCommunityInputChange}
                      placeholder="Jane Doe"
                      className="w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="authorEmail">
                      Your Email (optional)
                    </label>
                    <input
                      id="authorEmail"
                      name="authorEmail"
                      type="email"
                      value={blogForm.authorEmail}
                      onChange={handleCommunityInputChange}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="title">
                  Blog Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={blogForm.title}
                  onChange={handleCommunityInputChange}
                  placeholder="How I built a distraction-free study routine"
                  className="w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="category">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={blogForm.category}
                    onChange={handleCommunityInputChange}
                    className="w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30"
                  >
                    {Object.keys(categoryColors).map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="coverImage">
                      Cover Image URL (optional)
                    </label>
                    <input
                      id="coverImage"
                      name="coverImage"
                      type="url"
                      value={blogForm.coverImage}
                      onChange={handleCommunityInputChange}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="coverImageFile">
                      Choose Cover Image File (optional)
                    </label>
                    <input
                      ref={coverImageInputRef}
                      id="coverImageFile"
                      name="coverImageFile"
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      onChange={handleCoverImageFileChange}
                      className="w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-gray-900 dark:text-white outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-blue-700 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-800"
                    />

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{blogForm.coverImageFile ? `Selected: ${blogForm.coverImageFile.name}` : 'No file selected'}</span>
                      {blogForm.coverImageFile && (
                        <button
                          type="button"
                          onClick={clearSelectedCoverImageFile}
                          className="rounded-full border border-gray-300 dark:border-slate-600 px-3 py-1 font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                        >
                          Remove file
                        </button>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Both options are available. If you provide both URL and file, uploaded file is used as cover image.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="excerpt">
                  Short Excerpt
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  rows={3}
                  minLength={BLOG_EXCERPT_MIN_LENGTH}
                  maxLength={BLOG_EXCERPT_MAX_LENGTH}
                  value={blogForm.excerpt}
                  onChange={handleCommunityInputChange}
                  placeholder="Give readers a quick summary of your article..."
                  className="w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200" htmlFor="content">
                  Full Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={8}
                  minLength={BLOG_CONTENT_MIN_LENGTH}
                  maxLength={BLOG_CONTENT_MAX_LENGTH}
                  value={blogForm.content}
                  onChange={handleCommunityInputChange}
                  placeholder="Write your complete blog here..."
                  className="w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30"
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Tip: add headings like ## Morning Planning or ## Deep Work Block in your content to generate a cleaner table of contents.
                </p>
              </div>

              {submitError && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-300">
                  {submitError}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user ? `Publishing as ${user.displayName || user.email || 'community member'}.` : 'Publishing as a community guest.'}
                </p>
                <button
                  type="submit"
                  disabled={submitPending}
                  className="inline-flex items-center rounded-full bg-blue-700 px-8 py-3 text-white font-semibold transition-all duration-300 hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitPending ? 'Publishing...' : 'Publish Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6 mt-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Most Popular
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Reader favorites that deliver real results
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6 mt-6">
            {}
            <Link to="/blog1" className="block mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-700 rounded-2xl p-6 shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-2xl transform hover:scale-105">
                <div className="border-l-4 border-blue-600 pl-6 flex items-start space-x-6">
                  <img
                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                    alt="Workplace productivity tips"
                    className="w-32 h-32 rounded-xl object-cover flex-shrink-0 shadow-md border-2 border-blue-200 dark:border-blue-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-block bg-blue-700 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase shadow-md">
                        Trending
                      </span>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Featured</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300">
                      How to Eliminate Distractions and Double Your Focus in 2025
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                      Master the art of deep work with these proven concentration techniques that top performers use daily...
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5m-15-4h14m-14 7h14" /></svg>
                        <span>8 min</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 3a7 7 0 100 14 7 7 0 000-14zM9 9a1 1 0 112 0 1 1 0 01-2 0z" /></svg>
                        <span>50K views</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {}
            <Link to="/blog2" className="block mb-6">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-700 dark:to-gray-700 rounded-2xl p-6 shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-600 hover:shadow-2xl transform hover:scale-105">
                <div className="border-l-4 border-cyan-600 pl-6 flex items-start space-x-6">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                    alt="Productive workspace setup"
                    className="w-32 h-32 rounded-xl object-cover flex-shrink-0 shadow-md border-2 border-cyan-200 dark:border-cyan-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-block bg-cyan-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase shadow-md">
                        Popular
                      </span>
                      <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">Most Read</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300">
                      The 90-Minute Work Block Method: Get More Done in Less Time
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                      Discover the optimal work rhythm that maximizes your mental energy and output throughout the day...
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5m-15-4h14m-14 7h14" /></svg>
                        <span>12 min</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 3a7 7 0 100 14 7 7 0 000-14zM9 9a1 1 0 112 0 1 1 0 01-2 0z" /></svg>
                        <span>42K views</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {}
            <Link to="/blog1" className="block mb-6">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 rounded-2xl p-6 shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-2xl transform hover:scale-105">
                <div className="border-l-4 border-indigo-600 pl-6 flex items-start space-x-6">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                    alt="Digital tools and technology"
                    className="w-32 h-32 rounded-xl object-cover flex-shrink-0 shadow-md border-2 border-indigo-200 dark:border-indigo-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-block bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase shadow-md">
                        Essential
                      </span>
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Must Read</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300">
                      Digital Minimalism: Declutter Your Workspace for Peak Performance
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                      Create a distraction-free digital environment that supports sustained focus and creative thinking...
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5m-15-4h14m-14 7h14" /></svg>
                        <span>15 min</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 3a7 7 0 100 14 7 7 0 000-14zM9 9a1 1 0 112 0 1 1 0 01-2 0z" /></svg>
                        <span>38K views</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {}
<section className="relative overflow-hidden py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">

  {/* Pastel / Neon Blobs */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-40 left-1/4 w-96 h-96 bg-cyan-300 dark:bg-cyan-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>

    <div 
      className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob"
      style={{ animationDelay: '1s' }}
    ></div>
  </div>

  {/* Content */}
  <div className="container mx-auto px-6 py-20 text-center relative z-10">
    <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
      Ready to Transform Your Productivity?
    </h2>

    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4">
      Join thousands who've transformed their work and life with our proven systems and strategies.
    </p>

    <Link
      to="/signup"
      className="inline-block bg-white dark:bg-gray-200 text-indigo-700 dark:text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 dark:hover:bg-gray-300 transform hover:scale-105 transition-all duration-300 shadow-lg m-3"
    >
      Start Your Journey
    </Link>

    <a
      href="#latest-articles"
      className="inline-block bg-transparent border-2 border-gray-700 text-gray-700 dark:border-white dark:text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-200 dark:hover:bg-white dark:hover:text-indigo-700 transform hover:scale-105 transition-all duration-300 m-3"
    >
      Browse All Articles
    </a>
  </div>

</section>

    </>
  );
};

export default Blog;