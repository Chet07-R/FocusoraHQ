import React from "react";
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <main className="bg-gradient-to-r from-indigo-300 to-cyan-100 dark:from-gray-900 dark:to-gray-800 min-h-screen relative overflow-hidden">
        <div className="min-h-screen flex flex-col lg:flex-row items-center justify-between px-8 lg:px-16 py-12">
          <div className="lg:w-1/2 text-left lg:pr-12">
            <h1 className="text-6xl lg:text-7xl font-extrabold text-blue-900 dark:text-white mb-6 tracking-tight leading-tight">FocusoraHQ</h1>
            <p className="text-2xl lg:text-3xl text-blue-800 dark:text-gray-300 font-medium mb-8">Focus. Study. Thrive.</p>
            <p className="text-blue-700 dark:text-gray-400">Your personal headquarters for productivity. Combat distraction, reclaim your focus, and achieve your goals in a serene and supportive online environment.</p>
          </div>

          <div className="lg:w-1/2 flex justify-center lg:justify-end items-end">
            <div className="relative">
              <lottie-player src="/animations/study-animations.json" background="transparent" speed="1" style={{ width: 300, height: 300 }} loop autoplay></lottie-player>
            </div>
          </div>
        </div>

        <div className="left-1/2 transform flex flex-col items-center">
          <a href="#features" className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-4 px-10 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 mb-4">Get Started</a>
          <div className="animate-bounce-down text-blue-800">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4V20M12 20L6 14M12 20L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
      </main>

      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white">Reach Your Pinnacle</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">An all-in-one productivity hub designed for deep work.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link to="/my-space" className="group">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Personal Workspace</h3>
                <p className="text-gray-600 dark:text-gray-400">A private, customizable sanctuary with all the tools you need to enter a state of deep work.</p>
              </div>
            </Link>

            <Link to="/study-room" className="group">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Study Rooms</h3>
                <p className="text-gray-600 dark:text-gray-400">Connect with friends or like-minded peers in a collaborative, distraction-free environment.</p>
              </div>
            </Link>

            <Link to="/blog" className="group">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-400 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Blog & Resources</h3>
                <p className="text-gray-600 dark:text-gray-400">Discover inspiring articles and actionable tips to enhance your focus and well-being.</p>
              </div>
            </Link>

            <Link to="/leaderboard" className="group">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Leaderboard</h3>
                <p className="text-gray-600 dark:text-gray-400">Add a competitive edge to your productivity with gamified analytics and global rankings.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-left">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-6">Craft Your Perfect Focus Sanctuary.</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Your personal workspace is a private, customizable zone designed for deep work. Eliminate distractions and arrange your digital desk with the tools you need to find your flow.</p>
            <ul className="space-y-4">
              <li className="flex">
                <svg className="w-6 h-6 text-indigo-500 dark:text-indigo-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="text-gray-700 dark:text-gray-300"><strong className="font-semibold">Integrated To-Do List:</strong> Organize and track tasks seamlessly.</span>
              </li>
              <li className="flex">
                <svg className="w-6 h-6 text-indigo-500 dark:text-indigo-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="text-gray-700 dark:text-gray-300"><strong className="font-semibold">Pomodoro Timer:</strong> Work in focused sprints with a built-in timer.</span>
              </li>
              <li className="flex">
                <svg className="w-6 h-6 text-indigo-500 dark:text-indigo-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="text-gray-700 dark:text-gray-300"><strong className="font-semibold">Ambiance Control:</strong> Curate your mood with Spotify and custom themes.</span>
              </li>
            </ul>
          </div>
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-pink-500 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                <div className="absolute top-0 right-0 w-1 bg-gradient-to-b from-pink-500 to-purple-500 h-0 group-hover:h-full transition-all duration-700 ease-out delay-300"></div>
                <div className="absolute bottom-0 right-0 h-1 bg-gradient-to-l from-purple-500 to-blue-500 w-0 group-hover:w-full transition-all duration-700 ease-out delay-700"></div>
                <div className="absolute bottom-0 left-0 w-1 bg-gradient-to-t from-blue-500 to-cyan-500 h-0 group-hover:h-full transition-all duration-700 ease-out delay-1000"></div>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-600 relative transition-all duration-300 group-hover:shadow-3xl group-hover:shadow-cyan-500/20">
                <img src="/images/my_space.png" alt="Personal Workspace UI" className="rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white">Trusted by Students & Professionals</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">See what our users are saying about FocusoraHQ.</p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {
              // Use a simple testimonials array so each card shows distinct info
              [
                { name: 'Bhavya Jain', role: 'Student', img: '/images/People/1.jpg' },
                { name: 'Vinit', role: 'Student', img: '/images/People/2.enc' },
                { name: 'Manju', role: 'Teacher', img: '/images/People/3.jpg' },
              ].map((t, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-700 p-8 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-lg flex flex-col items-center hover:scale-105 transition-transform duration-300">
                  <img src={t.img} alt={t.name} className="w-20 h-20 rounded-full border-4 border-purple-200 dark:border-purple-400 shadow mb-4 object-cover" />
                  <div className="flex items-center mb-2">
                    { Array.from({ length: 5 }).map((_, k) => (
                      <svg key={k} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><polygon points="10,1 12.59,7.36 19.51,7.36 13.97,11.64 16.56,18 10,13.72 3.44,18 6.03,11.64 0.49,7.36 7.41,7.36"/></svg>
                    )) }
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 italic mb-4">"FocusoraHQ completely changed how I study for exams. The study rooms keep me accountable."</p>
                  <p className="font-bold text-gray-800 dark:text-white">{t.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.role}</p>
                </div>
              ))
            }
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-black dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-6 py-20 text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">Ready to Reclaim Your Focus?</h2>
          <p className="mt-4 text-lg text-gray-300 dark:text-gray-400 max-w-2xl mx-auto">Join thousands of users who are boosting their productivity and achieving their goals. Get started for free today.</p>
          <a href="/pages/signup.html" className="mt-8 inline-block bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-400 hover:from-cyan-500 hover:via-blue-500 hover:to-pink-500 text-white font-bold px-10 py-4 rounded-lg transition-all text-lg shadow-xl hover:shadow-2xl hover:scale-105 duration-300 ring-1 ring-white/20">Sign Up for Free</a>
        </div>
      </section>
    </>
  );
};

export default Home;
