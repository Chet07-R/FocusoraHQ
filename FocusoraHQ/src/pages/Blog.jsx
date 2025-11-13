import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Blog = () => {
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

  return (
    <>

      {/* Main Section */}
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

      {/* Featured Article Section */}
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
                {/* Image Container */}
                <div className="md:w-1/2 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    alt="Deep work and focus strategies"
                    className="w-full h-64 md:h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Content Container */}
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

      {/* Latest Articles Grid */}
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

          {/* Load More Articles */}
          <div className="text-center mt-12">
            <button className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 transform shadow-lg">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Popular Articles Section */}
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
            {/* Popular Article 1 */}
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

            {/* Popular Article 2 */}
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

            {/* Popular Article 3 */}
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

      {/* Sign Up Section */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-black dark:bg-gray-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        <div className="container mx-auto px-6 py-20 text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
            Ready to Transform Your Productivity?
          </h2>
          <p className="mt-4 text-lg text-gray-300 dark:text-gray-400 max-w-2xl mx-auto mb-4">
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
            className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-indigo-700 transform hover:scale-105 transition-all duration-300 m-3"
          >
            Browse All Articles
          </a>
        </div>
      </section>
    </>
  );
};

export default Blog;