import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { deleteBlog as deleteBlogApi, getBlogById } from '../utils/blogsApi';

const categoryColors = {
  Focus: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
  'Time Management': 'bg-cyan-100 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-400',
  Organization: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400',
  Goals: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
  Habits: 'bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-400',
  Energy: 'bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400',
};

const BlogCustom = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteError, setDeleteError] = useState('');

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
      <section className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex items-center justify-center px-4 py-16">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
          <p className="text-slate-300">Loading blog...</p>
        </div>
      </section>
    );
  }

  if (!blog) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center shadow-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold mb-4">
            Community Blog
          </div>
          <h1 className="text-3xl font-black mb-4">Blog not found</h1>
          <p className="text-slate-300 mb-8">
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
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white px-4 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto">
        <Link to="/blog" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blogs
        </Link>

        <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          <div className="relative">
            <img src={blog.coverImage} alt={blog.title} className="w-full h-72 sm:h-[28rem] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="bg-white text-slate-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide">
                  Community
                </span>
                <span className={`${categoryColors[blog.category] || categoryColors.Focus} px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide`}>
                  {blog.category}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black leading-tight mb-3">{blog.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                <span>By {blog.authorName || 'Focusora Member'}</span>
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                <span>{blog.readTime}</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <p className="text-sm text-slate-300">This is a community-created post.</p>
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
              <p className="mb-4 text-sm font-medium text-red-300">{deleteError}</p>
            )}

            <p className="text-lg sm:text-xl text-slate-200 leading-8 whitespace-pre-wrap">{blog.excerpt}</p>

            <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/60 p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-4">Full Article</h2>
              <div className="prose prose-invert max-w-none prose-p:text-slate-200 prose-headings:text-white prose-strong:text-white">
                <p className="whitespace-pre-wrap leading-8 text-slate-200">{blog.content}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogCustom;
