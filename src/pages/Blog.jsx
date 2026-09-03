import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAuthErrorMessage } from '../utils/authErrors';
import { createBlog as createBlogApi, defaultBlogCoverImage, deleteBlog as deleteBlogApi, listBlogs } from '../utils/blogsApi';
import '../components/blog.css';

const MAX_COVER_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const BLOG_TITLE_MIN_LENGTH = 3;
const BLOG_TITLE_MAX_LENGTH = 140;
const BLOG_EXCERPT_MIN_LENGTH = 20;
const BLOG_EXCERPT_MAX_LENGTH = 500;
const BLOG_CONTENT_MIN_LENGTH = 50;
const BLOG_CONTENT_MAX_LENGTH = 20000;

const Blog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const coverImageInputRef = useRef(null);

  const [visibleCount, setVisibleCount] = useState(6);
  const [communityBlogs, setCommunityBlogs] = useState([]);
  const [communityLoading, setCommunityLoading] = useState(true);
  const [communityError, setCommunityError] = useState('');
  const [submitPending, setSubmitPending] = useState(false);
  const [deletePendingBlogId, setDeletePendingBlogId] = useState('');
  const [submitError, setSubmitError] = useState('');
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  useEffect(() => {
    document.title = "FocusoraHQ | Productivity & Study Blogs";
  }, []);

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

  const filteredArticles = allArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const articles = filteredArticles.slice(0, visibleCount);

  const loadMoreArticles = () => {
    setVisibleCount(prev => Math.min(prev + 6, filteredArticles.length));
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
    if (!user) {
      navigate('/signin');
      return;
    }

    setSubmitError('');
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

  const filteredCommunityBlogs = communityBlogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (blog.excerpt && blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (blog.authorName && blog.authorName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCommunitySubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    if (!user) {
      setSubmitError('You must be signed in to add your own blog post.');
      return;
    }

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

    setSubmitPending(true);

    try {
      const createdBlog = await createBlogApi(payload);
      setCommunityBlogs((prev) => [createdBlog, ...prev]);
      showToast('Your blog has been successfully published!', 'success');
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
      showToast(getAuthErrorMessage(error, 'Unable to publish your blog right now.'), 'error');
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

    try {
      await deleteBlogApi(blogId);
      setCommunityBlogs((prev) => prev.filter((blog) => String(blog.id || blog._id) !== String(blogId)));
      showToast('Blog deleted successfully.', 'success');
    } catch (error) {
      showToast(getAuthErrorMessage(error, 'Unable to delete this blog right now.'), 'error');
    } finally {
      setDeletePendingBlogId('');
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      {/* 🚀 Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-950 text-white pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-16 md:pb-24 overflow-hidden border-b border-indigo-950/20">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-500/10 rounded-full filter blur-[120px] animate-pulse"></div>
          <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-purple-500/10 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12">
            <div className="w-full lg:w-3/5 text-left space-y-3.5 sm:space-y-6">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                Productivity & Study Resource
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Supercharge Your <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Focus & Learning</span>
              </h1>
              <p className="text-xs sm:text-base lg:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
                Explore actionable systems, expert guides, and scientific study strategies to level up your flow, time management, and mindset.
              </p>
              <div className="flex flex-row items-center gap-2.5 sm:gap-4 pt-1 sm:pt-2">
                <a
                  href="#latest-articles"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm md:text-base transition-all duration-300 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 active:scale-[0.98] text-center"
                >
                  Explore Articles
                </a>
                <button
                  onClick={openBlogModal}
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/15 px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm md:text-base transition-all duration-300 active:scale-[0.98] text-center"
                >
                  Share Your Story
                </button>
              </div>
            </div>
            <div className="hidden md:flex lg:w-2/5 justify-center lg:justify-end">
              <div className="relative group">
                {/* Glow ring */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-500 opacity-20 blur-xl group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="Productive study workspace"
                  className="relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 object-cover rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🏆 Featured Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
            <span className="h-6 sm:h-8 w-1 rounded-full bg-blue-600"></span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Featured Article</h2>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="group bg-gradient-to-br from-indigo-50/50 via-cyan-50/20 to-white dark:from-slate-800/40 dark:via-slate-800/20 dark:to-slate-900/60 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-lg sm:shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-1">
              <div className="md:flex">
                <div className="md:w-1/2 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent z-10"></div>
                  <img
                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Deep work and focus strategies"
                    className="w-full h-48 sm:h-64 md:h-full object-cover featured-article-img"
                  />
                  <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 z-20 md:hidden">
                    <span className="bg-blue-600 text-white px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide">Featured</span>
                  </div>
                </div>

                <div className="md:w-1/2 p-4 sm:p-6 md:p-10 lg:p-12 flex flex-col justify-between">
                  <div>
                    <div className="hidden md:inline-block bg-blue-600/10 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest mb-4">
                      Spotlight
                    </div>
                    <Link to="/blog1">
                      <h3 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug sm:leading-tight mb-2 sm:mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        The Ultimate Guide to Deep Work: Transform Your Productivity
                      </h3>
                    </Link>
                    <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6 line-clamp-3 md:line-clamp-none">
                      Master the art of sustained focus with proven strategies from top performers. Learn how to eliminate distractions, create optimal environments, and unlock flow states.
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs sm:text-sm font-semibold text-slate-400 dark:text-slate-500">15 min read • Dec 2024</span>
                    <Link
                      to="/blog1"
                      className="inline-flex items-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 hover:-translate-y-0.5"
                    >
                      Read Now
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔍 Category Filters Bar */}
      <section className="sticky top-[56px] sm:top-[64px] z-30 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 py-2.5 sm:py-3.5 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-3 sm:px-6">
          <div className="flex justify-start sm:justify-center">
            {/* Category Scrolling Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-0.5 scrollbar-none scroll-smooth justify-start sm:justify-center px-1">
              {['All', 'Focus', 'Time Management', 'Organization', 'Goals', 'Habits', 'Energy'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-200/70 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 📚 Articles Grid Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-slate-50 dark:bg-slate-950" id="latest-articles">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 mb-6 sm:mb-8 md:mb-10">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="h-6 sm:h-8 w-1 rounded-full bg-blue-600"></span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Latest Guides</h2>
            </div>
            {selectedCategory !== 'All' && (
              <span className="text-xs sm:text-sm font-medium text-slate-500 ml-3.5 sm:ml-0">
                Found {filteredArticles.length} guides in {selectedCategory}
              </span>
            )}
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-12 sm:py-16 px-4 sm:px-6 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/40 dark:border-slate-800/40 max-w-xl mx-auto shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">No Guides Found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm md:text-base mb-6 max-w-sm mx-auto">We couldn't find any articles matching your search query or selected category. Try another filter!</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="group bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/40 dark:border-slate-800/40 shadow-sm sm:shadow-md premium-blog-card"
                >
                  <Link to={article.link}>
                    <div className="h-40 sm:h-48 overflow-hidden relative">
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 z-10">
                        <span className={`${categoryColors[article.category] || 'bg-blue-100 text-blue-600'} px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider`}>
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 sm:p-5 md:p-6 space-y-2 sm:space-y-2.5">
                      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-semibold">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{article.readTime}</span>
                      </div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {article.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
                        {article.description}
                      </p>
                      <div className="pt-1.5 sm:pt-2 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                        <span>Read Guide</span>
                        <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}

          {visibleCount < filteredArticles.length && (
            <div className="text-center mt-8 sm:mt-12">
              <button
                onClick={loadMoreArticles}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm md:text-base transition-all duration-300 hover:shadow-lg shadow-blue-500/10 cursor-pointer"
              >
                Load More Articles
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 👥 Community Blogs Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-white dark:bg-slate-900 border-t border-b border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6 mb-6 sm:mb-10">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="h-6 sm:h-8 w-1 rounded-full bg-blue-600"></span>
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Community Logs</h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">Read systems and reflections from the Focusora network.</p>
              </div>
            </div>
            <button
              onClick={openBlogModal}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 shadow-md shadow-blue-500/10 hover:-translate-y-0.5 w-fit"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              Share Your Log
            </button>
          </div>

          {communityLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200/40 dark:border-slate-800/40 p-4 sm:p-6 space-y-3 sm:space-y-4 animate-pulse">
                  <div className="h-36 sm:h-48 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                    <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                    <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!communityLoading && communityError && (
            <div className="max-w-lg mx-auto p-4 sm:p-6 rounded-2xl border border-red-100 bg-red-50/50 dark:border-red-500/20 dark:bg-red-950/20 text-center">
              <p className="text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400 mb-3">{communityError}</p>
              <button
                onClick={loadCommunityBlogs}
                className="bg-blue-600 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-bold"
              >
                Retry Sync
              </button>
            </div>
          )}

          {!communityLoading && !communityError && filteredCommunityBlogs.length === 0 && (
            <div className="max-w-xl mx-auto p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-200/40 dark:border-slate-800/40 text-center shadow-lg sm:shadow-xl bg-slate-50/50 dark:bg-slate-900/50 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="h-8 w-8 sm:h-10 sm:w-10 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">Be the first spotlight author</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm md:text-base mb-6 sm:mb-8 max-w-sm mx-auto">Share your workflow, morning setup, or study systems with developers and students worldwide.</p>
              <button
                onClick={openBlogModal}
                className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-600 hover:via-blue-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                Publish First Log
              </button>
            </div>
          )}

          {!communityLoading && !communityError && filteredCommunityBlogs.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {filteredCommunityBlogs.slice(0, 9).map((blog) => (
                <article
                  key={blog.id || blog._id}
                  className="group bg-slate-50 dark:bg-slate-950 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 shadow-sm sm:shadow-md premium-blog-card flex flex-col h-full"
                >
                  <Link to={`/blog/community/${blog.id || blog._id}`} className="flex-1 flex flex-col">
                    <div className="h-36 sm:h-44 overflow-hidden relative">
                      <img
                        src={blog.coverImage || defaultBlogCoverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-indigo-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
                          {blog.category || 'Focus'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5 sm:space-y-2">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-snug">
                          {blog.title}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
                          {blog.excerpt}
                        </p>
                      </div>
                      <div className="pt-3 flex items-center justify-between text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-semibold border-t border-slate-200/40 dark:border-slate-800/40 mt-3 sm:mt-4">
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-blue-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="truncate max-w-[100px] sm:max-w-none">{blog.authorName || 'Focusora Member'}</span>
                        </span>
                        <span className="flex items-center gap-1 shrink-0">
                          <svg className="w-3.5 h-3.5 text-indigo-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatBlogDate(blog.createdAt)}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {user && String(blog.authorId) === String(user.uid) && (
                    <div className="p-3 sm:p-4 bg-slate-100/50 dark:bg-slate-950/20 border-t border-slate-200/50 dark:border-slate-800/50">
                      <button
                        type="button"
                        onClick={() => handleDeleteCommunityBlog(blog.id || blog._id)}
                        disabled={deletePendingBlogId === String(blog.id || blog._id)}
                        className="w-full bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white py-1.5 rounded-lg text-xs font-bold transition-all duration-300"
                      >
                        {deletePendingBlogId === String(blog.id || blog._id) ? 'Deleting...' : 'Delete Log'}
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 🏆 Popular Reads Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2.5 sm:gap-3 mb-6 sm:mb-8 md:mb-10">
            <span className="h-6 sm:h-8 w-1 rounded-full bg-blue-600"></span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Most Popular</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
            {/* Pop Card 1 */}
            <Link to="/blog1" className="group block">
              <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200/40 dark:border-slate-800/40 shadow-sm premium-blog-card">
                <div className="flex items-center sm:items-start gap-3.5 sm:gap-5">
                  <img
                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                    alt="Workplace productivity tips"
                    className="w-18 h-18 sm:w-24 sm:h-24 rounded-lg sm:rounded-xl object-cover shadow-sm border border-slate-100 dark:border-slate-800 shrink-0"
                  />
                  <div className="flex-1 space-y-1 min-w-0">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Trending</span>
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate sm:whitespace-normal">
                      How to Eliminate Distractions and Double Focus
                    </h3>
                    <p className="text-slate-500 text-[11px] sm:text-xs line-clamp-2 leading-relaxed">
                      Master deep work loops using proven focus block timings utilized by software architects and top students.
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Pop Card 2 */}
            <Link to="/blog2" className="group block">
              <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200/40 dark:border-slate-800/40 shadow-sm premium-blog-card">
                <div className="flex items-center sm:items-start gap-3.5 sm:gap-5">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                    alt="Productive workspace"
                    className="w-18 h-18 sm:w-24 sm:h-24 rounded-lg sm:rounded-xl object-cover shadow-sm border border-slate-100 dark:border-slate-800 shrink-0"
                  />
                  <div className="flex-1 space-y-1 min-w-0">
                    <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">Must Read</span>
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate sm:whitespace-normal">
                      The 90-Minute Work Block Method
                    </h3>
                    <p className="text-slate-500 text-[11px] sm:text-xs line-clamp-2 leading-relaxed">
                      Optimize your biological ultradian rhythms to maximize productive cycles without triggering cognitive exhaustion.
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 🚀 Interactive Footer CTA */}
      <section className="relative overflow-hidden py-12 sm:py-16 md:py-24 bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-950 text-white text-center">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-3xl space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">Ready to Master Your Attention?</h2>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-lg mx-auto">
            Build streaks, sync ambient spaces, and access tailored AI coaching designed to align your learning flow.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 pt-1 sm:pt-2">
            <Link
              to="/signup"
              className="bg-white text-slate-900 hover:bg-slate-100 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm md:text-base transition-all duration-300 shadow-xl"
            >
              Sign Up Free
            </Link>
            <a
              href="#latest-articles"
              className="bg-transparent border border-white/25 text-white hover:bg-white/5 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm md:text-base transition-all duration-300"
            >
              Back to Articles
            </a>
          </div>
        </div>
      </section>

      {/* 📝 Create Blog Modal Popup */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={closeBlogModal}></div>
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100 dark:border-slate-800 mb-4 sm:mb-6">
              <div>
                <h3 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">Write Community Log</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">Share strategies, workspace designs, or reflections.</p>
              </div>
              <button
                onClick={closeBlogModal}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCommunitySubmit} className="space-y-3.5 sm:space-y-5">
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={blogForm.title}
                  onChange={handleCommunityInputChange}
                  placeholder="e.g. My 5:00 AM Study Loop Routine"
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    name="category"
                    value={blogForm.category}
                    onChange={handleCommunityInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {Object.keys(categoryColors).map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Cover URL (Optional)</label>
                  <input
                    type="url"
                    name="coverImage"
                    value={blogForm.coverImage}
                    onChange={handleCommunityInputChange}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Cover File (Optional)</label>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <input
                    ref={coverImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageFileChange}
                    className="hidden"
                    id="file-upload-input"
                  />
                  <label
                    htmlFor="file-upload-input"
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-bold cursor-pointer transition-all duration-300 border border-slate-200/50 dark:border-slate-800/50"
                  >
                    Choose Cover Image File
                  </label>
                  <span className="text-[11px] sm:text-xs text-slate-400 truncate max-w-[150px] sm:max-w-xs">
                    {blogForm.coverImageFile ? blogForm.coverImageFile.name : 'No file (2MB max)'}
                  </span>
                  {blogForm.coverImageFile && (
                    <button
                      type="button"
                      onClick={clearSelectedCoverImageFile}
                      className="text-red-500 hover:text-red-600 text-xs font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Short Summary</label>
                <input
                  type="text"
                  name="excerpt"
                  required
                  value={blogForm.excerpt}
                  onChange={handleCommunityInputChange}
                  placeholder="Summarize the core focus takeaway in 1-2 sentences..."
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Full Markdown Content</label>
                <textarea
                  name="content"
                  required
                  rows={5}
                  value={blogForm.content}
                  onChange={handleCommunityInputChange}
                  placeholder="Share details, schedules, tips, or setups..."
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {submitError && (
                <div className="p-2.5 sm:p-3 bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-500/20 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400">
                  {submitError}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 truncate max-w-[130px] sm:max-w-none">
                  By {user?.displayName || 'Member'}
                </span>
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={closeBlogModal}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg text-xs font-bold shadow-md shadow-blue-500/10"
                  >
                    {submitPending ? 'Publishing...' : 'Publish'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {toast.show && (
        <div className={`fixed bottom-24 left-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border transition-all duration-500 animate-slideInUp ${
          toast.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
            : 'bg-red-50 dark:bg-red-950/90 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800'
        }`}>
          {toast.type === 'success' ? (
            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default Blog;