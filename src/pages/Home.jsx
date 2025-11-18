import React from "react";
import { Link } from 'react-router-dom';
import './Home.css';


const Home = () => {
  return (
    <>
      <main className="bg-gradient-to-r from-indigo-300 to-cyan-100 dark:from-gray-900 dark:to-gray-800 min-h-screen relative overflow-hidden flex flex-col lg:justify-start pt-24 lg:pt-20">
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-16 flex flex-col lg:flex-row items-center justify-between relative z-10 flex-grow lg:flex-grow-0 lg:mt-8">
          
          <div className="w-full lg:w-1/2 text-center lg:text-left lg:pr-12 mb-8 lg:mb-0">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-blue-900 dark:text-white mb-4 tracking-tight leading-tight">
              FocusoraHQ
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-blue-800 dark:text-gray-300 font-medium mb-6">
              Focus. Study. Thrive.
            </p>

            <p className="text-base sm:text-lg text-blue-700 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Your personal headquarters for productivity. Combat distraction, reclaim your focus, and achieve your goals in a serene and supportive online environment.
            </p>
          </div>

          <div className="w-full lg:w-1/2 flex flex-grow lg:flex-grow-0 justify-center lg:justify-end items-center">
            <div className="relative w-full max-w-[280px] sm:max-w-[350px] lg:max-w-[450px]">
              <lottie-player 
                src="/animations/study-animations.json" 
                background="transparent" 
                speed="1" 
                style={{ width: '100%', height: 'auto' }} 
                loop 
                autoplay
              ></lottie-player>
            </div>
          </div>

        </div>

        <div className="w-full flex flex-col items-center mt-auto pb-8 lg:mt-0 lg:pb-0 lg:absolute lg:bottom-8 lg:left-0 lg:z-20">
          
          <a href="#features" className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-10 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 mb-4">
            Get Started
          </a>

          <div className="animate-bounce text-blue-800 dark:text-blue-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V20M12 20L6 14M12 20L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          
        </div>

      </main>

      <section id="features" className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white">
              Reach Your Pinnacle
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400">
              An all-in-one productivity hub designed for deep work.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">

            {[
              { 
                to: "/my-space", 
                bgColor: "bg-indigo-100 dark:bg-indigo-900", 
                textColor: "text-indigo-600 dark:text-indigo-400",
                iconPath: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", 
                title: "Personal Workspace", 
                desc: "A private, customizable sanctuary with all the tools you need to enter a state of deep work." 
              },
              { 
                to: "/study-room", 
                bgColor: "bg-purple-100 dark:bg-purple-900", 
                textColor: "text-purple-600 dark:text-purple-400",
                iconPath: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", 
                title: "Study Rooms", 
                desc: "Connect with friends or like-minded peers in a collaborative, distraction-free environment." 
              },
              { 
                to: "/blog", 
                bgColor: "bg-sky-100 dark:bg-sky-900", 
                textColor: "text-sky-600 dark:text-sky-400",
                iconPath: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", 
                title: "Blog & Resources", 
                desc: "Discover inspiring articles and actionable tips to enhance your focus and well-being." 
              },
              { 
                to: "/leaderboard", 
                bgColor: "bg-amber-100 dark:bg-amber-900", 
                textColor: "text-amber-600 dark:text-amber-400",
                iconPath: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z", 
                title: "Leaderboard", 
                desc: "Add a competitive edge to your productivity with gamified analytics and global rankings." 
              }
            ].map((item, idx) => (
              <Link key={idx} to={item.to} className="group h-full">
                <div className="h-full bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl border-2 border-transparent shadow-xl hover:shadow-2xl hover:border-blue-500 dark:hover:border-blue-400 hover:scale-105 hover:-translate-y-2 transition-all duration-300 flex flex-col">
                  <div className={`${item.bgColor} ${item.textColor} w-12 h-12 rounded-full flex items-center justify-center mb-4 shrink-0`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.iconPath} />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800 dark:text-white">{item.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 flex-grow">{item.desc}</p>
                </div>
              </Link>
            ))}

          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          <div className="text-left order-2 lg:order-1">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-6">
              Craft Your Perfect Focus Sanctuary.
            </h2>

            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-8">
              Your personal workspace is a private, customizable zone designed for deep work. Eliminate distractions and arrange your digital desk with the tools you need to find your flow.
            </p>

            <ul className="space-y-4">
              {[
                { label: "Integrated To-Do List", desc: "Organize and track tasks seamlessly." },
                { label: "Pomodoro Timer", desc: "Work in focused sprints with a built-in timer." },
                { label: "Ambiance Control", desc: "Curate your mood with Spotify and custom themes." }
              ].map((feat, i) => (
                <li key={i} className="flex items-start">
                   <svg className="w-6 h-6 text-indigo-500 dark:text-indigo-400 mr-3 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base"><strong className="font-semibold">{feat.label}:</strong> {feat.desc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center order-1 lg:order-2">
            <div className="relative group w-full max-w-md lg:max-w-full">
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-pink-500 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                <div className="absolute top-0 right-0 w-1 bg-gradient-to-b from-pink-500 to-purple-500 h-0 group-hover:h-full transition-all duration-700 ease-out delay-300"></div>
                <div className="absolute bottom-0 right-0 h-1 bg-gradient-to-l from-purple-500 to-blue-500 w-0 group-hover:w-full transition-all duration-700 ease-out delay-700"></div>
                <div className="absolute bottom-0 left-0 w-1 bg-gradient-to-t from-blue-500 to-cyan-500 h-0 group-hover:h-full transition-all duration-700 ease-out delay-1000"></div>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 p-2 sm:p-4 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-600 relative transition-all duration-300 group-hover:shadow-3xl group-hover:shadow-cyan-500/20">
                <img src="/images/my_space.png" alt="Personal Workspace UI" className="rounded-lg w-full h-auto object-cover" />
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">Trusted by Students & Professionals</h2>
          
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400">See what our users are saying about FocusoraHQ.</p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {
              [
                { name: 'Bhavya Jain', role: 'Student', img: '/images/People/1.jpg' },
                { name: 'Vinit', role: 'Student', img: '/images/People/2.enc' },
                { name: 'Manju', role: 'Teacher', img: '/images/People/3.jpg' },
              ].map((t, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-700 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-lg flex flex-col items-center hover:scale-105 transition-transform duration-300 h-full">

                  <img src={t.img} alt={t.name} className="w-20 h-20 rounded-full border-4 border-purple-200 dark:border-purple-400 shadow mb-4 object-cover" />

                  <div className="flex items-center mb-2">
                    { Array.from({ length: 5 }).map((_, k) => (
                      <svg key={k} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <polygon points="10,1 12.59,7.36 19.51,7.36 13.97,11.64 16.56,18 10,13.72 3.44,18 6.03,11.64 0.49,7.36 7.41,7.36"/>
                      </svg>
                    )) }
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 italic mb-4 text-sm sm:text-base flex-grow">
                    "FocusoraHQ completely changed how I study for exams. The study rooms keep me accountable."
                  </p>

                  <div className="mt-auto">
                    <p className="font-bold text-gray-800 dark:text-white">{t.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.role}</p>
                  </div>

                </div>
              ))
            }
          </div>

        </div>
      </section>

      <section className="relative overflow-hidden py-20 sm:py-28 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-300 dark:bg-cyan-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 dark:from-cyan-500/20 dark:to-purple-500/20 border border-cyan-500/20 dark:border-cyan-500/30 backdrop-blur-sm">
              <svg className="w-4 h-4 text-cyan-600 dark:text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Join 10,000+ Focused Students</span>
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Ready to Reclaim
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">Your Focus?</span>
          </h2>

          <p className="text-lg sm:text-xl text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands of users who are boosting their productivity and achieving their goals. Get started for free today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link 
              to="/signup" 
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-lg shadow-2xl hover:shadow-cyan-500/50 dark:hover:shadow-cyan-400/30 transition-all duration-300 hover:scale-105 overflow-hidden w-full sm:w-auto"
              style={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)'
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="relative z-10">Start Today</span>
              <svg className="w-5 h-5 relative z-10 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            <Link 
              to="/about" 
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-gray-700 dark:text-gray-200 text-lg border-2 border-gray-300 dark:border-gray-600 hover:border-cyan-500 dark:hover:border-cyan-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 w-full sm:w-auto"
            >
              <span>Learn More</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

    </>
  );
};


export default Home;
