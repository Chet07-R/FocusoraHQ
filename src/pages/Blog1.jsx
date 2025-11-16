import React from 'react';
import { Link } from 'react-router-dom';
import '../components/blog.css';
import Navbar from "../components/Navbar";

const Blog1 = () => {
  return (
    <>
    
    {/*  Article Header  */}
    <article className="py-6 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">

                <div className="mt-8 text-center mb-8 sm:mb-12">
                    <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full">Productivity</span>
                        <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full">Deep Work</span>
                        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full">30-Day Guide</span>
                    </div>
                    
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight px-4 sm:px-0">
                        The Ultimate Guide to Deep Work
                    </h1>
                    
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 font-light px-4 sm:px-0">
                        Transform Your Productivity in 30 Days
                    </p>

                    {/*  Author and Date  */}
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6 sm:mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm sm:text-base">CV</span>
                            </div>
                            <div className="text-left">
                                <div className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Charlie Vance</div>
                                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Productivity Expert</div>
                            </div>
                        </div>
                        
                        <div className="hidden sm:block text-gray-400 dark:text-gray-500">•</div>
                        
                        <div className="flex items-center space-x-4 sm:space-x-6">
                            <div className="text-gray-600 dark:text-gray-400 text-center">
                                <div className="text-xs sm:text-sm">Published</div>
                                <div className="font-medium text-sm sm:text-base">Sep 6, 2025</div>
                            </div>
                            <div className="text-gray-400 dark:text-gray-500">•</div>
                            <div className="text-gray-600 dark:text-gray-400 text-center">
                                <div className="text-xs sm:text-sm">Read time</div>
                                <div className="font-medium text-sm sm:text-base">12 min</div>
                            </div>
                        </div>
                    </div>

                    {/*  Stats  */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-blue-200 dark:border-blue-800">
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">47%</div>
                            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Productivity Increase</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">30</div>
                            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Day Transformation</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">85%</div>
                            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </article>

    {/*  Main Content  */}
    <div className="container mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-12 max-w-7xl mx-auto">
           {/*  Sidebar  */}
<div className="lg:col-span-1 order-2 lg:order-1">
  <div className="bg-transparent rounded-xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-24 border border-gray-200/50 dark:border-gray-700/50">
    <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 text-gray-800 dark:text-white flex items-center gap-2">
      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
      Table of Contents
    </h3>

      {/*  Slider Indicator  */}
      <div className="toc-indicator absolute left-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out" style={{height: '36px', top: '0'}}></div>
      
      <div className="space-y-1 relative pl-4">
        <a href="#introduction" className="toc-link block py-2 px-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors text-xs sm:text-sm font-medium">
          What is Deep Work?
        </a>
        <a href="#science" className="toc-link block py-2 px-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors text-xs sm:text-sm font-medium">
          The Science Behind Deep Work
        </a>
        <a href="#benefits" className="toc-link block py-2 px-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors text-xs sm:text-sm font-medium">
          Benefits & Impact
        </a>
        <a href="#challenges" className="toc-link block py-2 px-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors text-xs sm:text-sm font-medium">
          Common Challenges
        </a>
        <a href="#day-plan" className="toc-link block py-2 px-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors text-xs sm:text-sm font-medium">
          30-Day Action Plan
        </a>
        <a href="#techniques" className="toc-link block py-2 px-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors text-xs sm:text-sm font-medium">
          Proven Techniques
        </a>
        <a href="#tracking" className="toc-link block py-2 px-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors text-xs sm:text-sm font-medium">
          Progress Tracking
        </a>
      </div>
  </div>
</div>


            {/*  Article Content  */}
            <div className="lg:col-span-3 order-1 lg:order-2">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    {/*  Image  */}
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 sm:p-12 text-center">
                        
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Master Deep Work in 30 Days</h2>
                        <p className="text-blue-100 text-sm sm:text-base">Your complete transformation guide</p>
                    </div>

                    <div className="p-4 sm:p-8 md:p-12">
                        {/*  Introduction  */}
                        <section id="introduction" className="mb-12 sm:mb-16">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
                                What is Deep Work?
                            </h2>
                            
                            <div className="prose prose-lg max-w-none">
                                <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed">
                                    Deep work is the ability to focus without distraction on a cognitively demanding task. Coined by productivity expert Cal Newport, this concept has become the holy grail of modern productivity—and for good reason.
                                </p>

                                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 sm:p-6 rounded-r-lg mb-6 sm:mb-8">
                                    <p className="text-base sm:text-lg text-blue-900 dark:text-blue-200 italic">
                                        "Deep work is the ability to concentrate on a task without any distractions. It allows you to overcome challenges, master new skills more quickly, and produce high-quality results."
                                    </p>
                                    <cite className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 mt-2 block">— ProofHub Research on Deep Work</cite>
                                </div>

                                <p className="mb-4 sm:mb-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                    In our hyperconnected world, the average knowledge worker checks email every 6 minutes and gets interrupted every 11 minutes. This constant fragmentation of attention creates what Newport calls "shallow work"—tasks that are logistical in nature, performed while distracted, and don't create much new value.
                                </p>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 sm:p-6 rounded-lg">
                                        <h4 className="font-bold text-red-800 dark:text-red-300 mb-3 flex items-center text-sm sm:text-base">
                                            Shallow Work
                                        </h4>
                                        <ul className="space-y-1 sm:space-y-2 text-red-700 dark:text-red-300 text-xs sm:text-sm">
                                            <li>• Constant email checking and responding</li>
                                            <li>• Social media scrolling and messaging</li>
                                            <li>• Frequent meeting attendance</li>
                                            <li>• Administrative tasks with low value</li>
                                            <li>• Multitasking between different projects</li>
                                        </ul>
                                    </div>
                                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 sm:p-6 rounded-lg">
                                        <h4 className="font-bold text-green-800 dark:text-green-300 mb-3 flex items-center text-sm sm:text-base">
                                             Deep Work
                                        </h4>
                                        <ul className="space-y-1 sm:space-y-2 text-green-700 dark:text-green-300 text-xs sm:text-sm">
                                            <li>• Writing, coding, or creative work</li>
                                            <li>• Strategic thinking and planning</li>
                                            <li>• Learning complex new skills</li>
                                            <li>• Research and analysis projects</li>
                                            <li>• Problem-solving and innovation</li>
                                        </ul>
                                    </div>
                                </div>

                                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                                    The three pillars of deep work are skilled work (utilizing your professional abilities), singular focus (concentrating on one task), and valuable output (producing high-quality results).
                                </p>
                            </div>
                        </section>

                        {/*  The Science Behind Deep Work  */}
                        <section id="science" className="mb-12 sm:mb-16">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
                                The Science Behind Deep Work
                            </h2>

                            <div className="mb-6 sm:mb-8">
                                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-4 sm:mb-6">
                                    Research from the University of California reveals that it takes an average of 23 minutes to recover focus after an interruption. This finding has profound implications for productivity in our distraction-heavy work environment.
                                </p>

                                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6">
                                    <h4 className="font-bold text-orange-800 dark:text-orange-300 mb-3 text-sm sm:text-base">The 23-Minute Rule</h4>
                                    <p className="text-orange-800 dark:text-orange-300 text-sm sm:text-base">
                                        If you're interrupted just 18 times during a 7-hour workday, you spend zero time in focused work. This explains why you can work all day and feel like you've accomplished nothing.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                                    <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                        
                                        <h5 className="font-bold mb-2 text-gray-800 dark:text-white text-sm sm:text-base">Neuroplasticity</h5>
                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Deep work strengthens neural pathways associated with concentration</p>
                                    </div>
                                    <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                                        
                                        <h5 className="font-bold mb-2 text-gray-800 dark:text-white text-sm sm:text-base">Flow State</h5>
                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Prolonged focus triggers optimal performance states</p>
                                    </div>
                                    <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                        
                                        <h5 className="font-bold mb-2 text-gray-800 dark:text-white text-sm sm:text-base">Attention Residue</h5>
                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Task-switching leaves cognitive fragments that impair performance</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/*  Benefits & Impact  */}
                        <section id="benefits" className="mb-12 sm:mb-16">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
                                Benefits & Impact
                            </h2>

                            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6 sm:mb-8">
                                Deep work delivers measurable improvements across multiple dimensions of professional and personal performance:
                            </p>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 p-4 sm:p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <h4 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-blue-800 dark:text-blue-300 flex items-center">
                                         Enhanced Productivity
                                    </h4>
                                    <ul className="space-y-1 sm:space-y-2 text-blue-700 dark:text-blue-300 text-sm">
                                        <li>• 2-3x faster task completion with fewer errors</li>
                                        <li>• Higher quality output in less time</li>
                                        <li>• Ability to tackle complex, high-value projects</li>
                                        <li>• Reduced need for revision and correction</li>
                                    </ul>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 p-4 sm:p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                                    <h4 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-purple-800 dark:text-purple-300 flex items-center">
                                         Accelerated Learning
                                    </h4>
                                    <ul className="space-y-1 sm:space-y-2 text-purple-700 dark:text-purple-300 text-sm">
                                        <li>• Faster skill acquisition and mastery</li>
                                        <li>• Better retention of complex information</li>
                                        <li>• Enhanced critical thinking abilities</li>
                                        <li>• Improved problem-solving capacity</li>
                                    </ul>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 p-4 sm:p-6 rounded-lg border border-green-200 dark:border-green-800">
                                    <h4 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-green-800 dark:text-green-300 flex items-center">
                                         Career Advancement
                                    </h4>
                                    <ul className="space-y-1 sm:space-y-2 text-green-700 dark:text-green-300 text-sm">
                                        <li>• Competitive advantage in knowledge work</li>
                                        <li>• Recognition for high-quality contributions</li>
                                        <li>• Increased opportunities for promotion</li>
                                        <li>• Greater professional reputation</li>
                                    </ul>
                                </div>

                                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/30 p-4 sm:p-6 rounded-lg border border-orange-200 dark:border-orange-800">
                                    <h4 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-orange-800 dark:text-orange-300 flex items-center">
                                         Work-Life Balance
                                    </h4>
                                    <ul className="space-y-1 sm:space-y-2 text-orange-700 dark:text-orange-300 text-sm">
                                        <li>• Reduced stress and anxiety from always-on expectations</li>
                                        <li>• More time for personal interests and relationships</li>
                                        <li>• Greater sense of accomplishment</li>
                                        <li>• Improved overall life satisfaction</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800/50 dark:to-blue-900/20 p-6 sm:p-8 rounded-lg border border-gray-200 dark:border-gray-700">
                                <h4 className="font-bold text-lg sm:text-xl mb-4 text-gray-800 dark:text-white"> Research-Backed Results</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                    <div className="text-center">
                                        <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">60%</div>
                                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">of knowledge workers spend time on coordination instead of skilled work</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">2x</div>
                                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">more work errors occur with small interruptions</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">75%</div>
                                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">of people accomplish more with fewer notifications</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/*  Common Challenges  */}
                        <section id="challenges" className="mb-12 sm:mb-16">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
                                 Common Challenges
                            </h2>

                            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6 sm:mb-8">
                                While the benefits of deep work are clear, implementation faces several significant obstacles in our modern work environment:
                            </p>

                            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 sm:p-6 rounded-r-lg">
                                    <h4 className="font-bold text-red-800 dark:text-red-300 mb-3 flex items-center text-sm sm:text-base">
                                         Digital Distractions
                                    </h4>
                                    <p className="text-red-700 dark:text-red-300 mb-3 text-sm sm:text-base">
                                        Social media, emails, notifications, and messaging apps create an always-on expectation that fragments attention throughout the day.
                                    </p>
                                    <div className="bg-red-100 dark:bg-red-900/30 p-3 sm:p-4 rounded-lg">
                                        <p className="text-xs sm:text-sm text-red-800 dark:text-red-200"><strong>Solution:</strong> Use apps like Freedom to block distracting websites, turn off non-essential notifications, and establish clear communication boundaries.</p>
                                    </div>
                                </div>

                                <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-4 sm:p-6 rounded-r-lg">
                                    <h4 className="font-bold text-orange-800 dark:text-orange-300 mb-3 flex items-center text-sm sm:text-base">
                                         Open Office Environments
                                    </h4>
                                    <p className="text-orange-700 dark:text-orange-300 mb-3 text-sm sm:text-base">
                                        Open-plan offices and noisy environments make sustained concentration nearly impossible, with constant visual and auditory interruptions.
                                    </p>
                                    <div className="bg-orange-100 dark:bg-orange-900/30 p-3 sm:p-4 rounded-lg">
                                        <p className="text-xs sm:text-sm text-orange-800 dark:text-orange-200"><strong>Solution:</strong> Use noise-canceling headphones, find quiet spaces, or negotiate remote work time for deep work sessions.</p>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 sm:p-6 rounded-r-lg">
                                    <h4 className="font-bold text-yellow-800 dark:text-yellow-300 mb-3 flex items-center text-sm sm:text-base">
                                         Mental Fatigue
                                    </h4>
                                    <p className="text-yellow-700 dark:text-yellow-300 mb-3 text-sm sm:text-base">
                                        Deep work requires significant cognitive effort and can lead to mental exhaustion if not properly managed with breaks and recovery.
                                    </p>
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 sm:p-4 rounded-lg">
                                        <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-200"><strong>Solution:</strong> Schedule regular breaks, maintain healthy sleep habits, and gradually build your deep work capacity over time.</p>
                                    </div>
                                </div>

                                <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-4 sm:p-6 rounded-r-lg">
                                    <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-3 flex items-center text-sm sm:text-base">
                                         Lack of Motivation
                                    </h4>
                                    <p className="text-purple-700 dark:text-purple-300 mb-3 text-sm sm:text-base">
                                        Complex or overwhelming tasks can create resistance and procrastination, making it difficult to begin deep work sessions.
                                    </p>
                                    <div className="bg-purple-100 dark:bg-purple-900/30 p-3 sm:p-4 rounded-lg">
                                        <p className="text-xs sm:text-sm text-purple-800 dark:text-purple-200"><strong>Solution:</strong> Break large projects into smaller tasks, use ritual and routine to build habits, and start with shorter deep work sessions.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/*  30-Day Action Plan  */}
                        <section id="day-plan" className="mb-12 sm:mb-16">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
                                 30-Day Deep Work Transformation Plan
                            </h2>

                            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6 sm:mb-8">
                                Transform your productivity with this structured 30-day program designed to build deep work habits progressively:
                            </p>

                            {/*  Week 1: Foundation  */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 sm:p-8 rounded-lg border border-blue-200 dark:border-blue-800 mb-6 sm:mb-8">
                                <h3 className="text-xl sm:text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4 sm:mb-6 flex items-center">
                                     Week 1: Foundation Building (Days 1-7)
                                </h3>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-3 text-sm sm:text-base">Goals</h4>
                                        <ul className="space-y-1 sm:space-y-2 text-blue-600 dark:text-blue-300 text-xs sm:text-sm">
                                            <li>• Establish baseline productivity metrics</li>
                                            <li>• Create dedicated deep work environment</li>
                                            <li>• Start with 25-minute focused sessions</li>
                                            <li>• Identify peak energy hours</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-3 text-sm sm:text-base">Daily Actions</h4>
                                        <ul className="space-y-1 sm:space-y-2 text-blue-600 dark:text-blue-300 text-xs sm:text-sm">
                                            <li>• Track current work patterns and interruptions</li>
                                            <li>• Set up distraction-blocking tools</li>
                                            <li>• Practice one 25-minute deep work session</li>
                                            <li>• Record energy levels throughout the day</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/*  Week 2: Skill Development  */}
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 sm:p-8 rounded-lg border border-purple-200 dark:border-purple-800 mb-6 sm:mb-8">
                                <h3 className="text-xl sm:text-2xl font-bold text-purple-800 dark:text-purple-300 mb-4 sm:mb-6 flex items-center">
                                     Week 2: Skill Development (Days 8-14)
                                </h3>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-3 text-sm sm:text-base">Goals</h4>
                                        <ul className="space-y-1 sm:space-y-2 text-purple-600 dark:text-purple-300 text-xs sm:text-sm">
                                            <li>• Extend sessions to 45 minutes</li>
                                            <li>• Develop focus rituals and routines</li>
                                            <li>• Practice attention restoration</li>
                                            <li>• Optimize work environment</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-3 text-sm sm:text-base">Daily Actions</h4>
                                        <ul className="space-y-1 sm:space-y-2 text-purple-600 dark:text-purple-300 text-xs sm:text-sm">
                                            <li>• Complete two 45-minute deep work blocks</li>
                                            <li>• Create and follow pre-work rituals</li>
                                            <li>• Take structured breaks between sessions</li>
                                            <li>• Adjust environment based on learnings</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/*  Week 3: Integration  */}
                            <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 sm:p-8 rounded-lg border border-green-200 dark:border-green-800 mb-6 sm:mb-8">
                                <h3 className="text-xl sm:text-2xl font-bold text-green-800 dark:text-green-300 mb-4 sm:mb-6 flex items-center">
                                    Week 3: Integration (Days 15-21)
                                </h3>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <h4 className="font-semibold text-green-700 dark:text-green-300 mb-3 text-sm sm:text-base">Goals</h4>
                                        <ul className="space-y-1 sm:space-y-2 text-green-600 dark:text-green-300 text-xs sm:text-sm">
                                            <li>• Achieve 90-minute focused sessions</li>
                                            <li>• Balance deep work with shallow tasks</li>
                                            <li>• Develop weekly scheduling system</li>
                                            <li>• Handle interruptions effectively</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-green-700 dark:text-green-300 mb-3 text-sm sm:text-base">Daily Actions</h4>
                                        <ul className="space-y-1 sm:space-y-2 text-green-600 dark:text-green-300 text-xs sm:text-sm">
                                            <li>• Complete 2-3 hours of deep work daily</li>
                                            <li>• Schedule shallow work in designated blocks</li>
                                            <li>• Practice saying no to non-essential meetings</li>
                                            <li>• Refine communication boundaries</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/*  Week 4: Mastery  */}
                            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 sm:p-8 rounded-lg border border-orange-200 dark:border-orange-800">
                                <h3 className="text-xl sm:text-2xl font-bold text-orange-800 dark:text-orange-300 mb-4 sm:mb-6 flex items-center">
                                Week 4: Maery (Days 22-30)
                                </h3>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-3 text-sm sm:text-base"> Goals </h4>
                                        <ul className="space-y-1 sm:space-y-2 text-orange-600 dark:text-orange-300 text-xs sm:text-sm">
                                            <li>• Sustain 3-4 hours of daily deep work</li>
                                            <li>• Develop personal deep work philosophy</li>
                                            <li>• Create long-term sustainability plan</li>
                                            <li>• Measure transformation results</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-3 text-sm sm:text-base"> Daily Actions</h4>
                                        <ul className="space-y-1 sm:space-y-2 text-orange-600 dark:text-orange-300 text-xs sm:text-sm">
                                            <li>• Complete complex, high-value projects</li>
                                            <li>• Fine-tune personal deep work system</li>
                                            <li>• Plan for continued growth and development</li>
                                            <li>• Document lessons learned and best practices</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/*  Proven Techniques  */}
                        <section id="techniques" className="mb-12 sm:mb-16">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
                             Proven Deep Work Techniques
                            </h2>

                            <div className="space-y-6 sm:space-y-8">
                                {/*  Pomodoro Technique  */}
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 sm:p-6 rounded-lg">
                                    <h4 className="font-bold text-lg sm:text-xl text-red-800 dark:text-red-300 mb-3 sm:mb-4 flex items-center">
                                     The Pomodoro Technique
                                    </h4>
                                    <p className="text-red-700 dark:text-red-300 mb-3 sm:mb-4 text-sm sm:text-base">
                                        Work in 25-minute focused sprints followed by 5-minute breaks. After 4 pomodoros, take a longer 15-30 minute break.
                                    </p>
                                    <div className="bg-red-100 dark:bg-red-900/30 p-3 sm:p-4 rounded-lg">
                                        <p className="text-xs sm:text-sm text-red-800 dark:text-red-200"><strong>Best for:</strong> Beginners, tasks requiring sustained attention, preventing burnout</p>
                                    </div>
                                </div>

                                {/*  Time Blocking  */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 sm:p-6 rounded-lg">
                                    <h4 className="font-bold text-lg sm:text-xl text-blue-800 dark:text-blue-300 mb-3 sm:mb-4 flex items-center">
                                     Time Blocking
                                    </h4>
                                    <p className="text-blue-700 dark:text-blue-300 mb-3 sm:mb-4 text-sm sm:text-base">
                                        Schedule specific blocks of time for deep work, treating them as unmovable appointments with yourself.
                                    </p>
                                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 sm:p-4 rounded-lg">
                                        <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200"><strong>Best for:</strong> Complex projects, strategic planning, maintaining consistency</p>
                                    </div>
                                </div>

                                {/*  The 90-Minute Rule  */}
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 sm:p-6 rounded-lg">
                                    <h4 className="font-bold text-lg sm:text-xl text-green-800 dark:text-green-300 mb-3 sm:mb-4 flex items-center">
                                     The 90-Minute Rule
                                    </h4>
                                    <p className="text-green-700 dark:text-green-300 mb-3 sm:mb-4 text-sm sm:text-base">
                                        Work in 90-minute cycles aligned with your natural ultradian rhythms for maximum cognitive performance.
                                    </p>
                                    <div className="bg-green-100 dark:bg-green-900/30 p-3 sm:p-4 rounded-lg">
                                        <p className="text-xs sm:text-sm text-green-800 dark:text-green-200"><strong>Best for:</strong> Creative work, problem-solving, when you have developed focus stamina</p>
                                    </div>
                                </div>

                                {/*  Batch Processing  */}
                                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 sm:p-6 rounded-lg">
                                    <h4 className="font-bold text-lg sm:text-xl text-purple-800 dark:text-purple-300 mb-3 sm:mb-4 flex items-center">
                                     Batch Processing
                                    </h4>
                                    <p className="text-purple-700 dark:text-purple-300 mb-3 sm:mb-4 text-sm sm:text-base">
                                        Group similar shallow tasks together and complete them in designated time blocks separate from deep work.
                                    </p>
                                    <div className="bg-purple-100 dark:bg-purple-900/30 p-3 sm:p-4 rounded-lg">
                                        <p className="text-xs sm:text-sm text-purple-800 dark:text-purple-200"><strong>Best for:</strong> Email, administrative tasks, routine activities, maintaining deep work boundaries</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/*  Progress Tracking  */}
                        <section id="tracking" className="mb-12 sm:mb-16">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
                             Progress Tracking & Measurement
                            </h2>

                            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6 sm:mb-8">
                                Measuring your deep work progress is essential for maintaining motivation and optimizing your approach. Track these key metrics:
                            </p>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 p-4 sm:p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <h4 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-blue-800 dark:text-blue-300 flex items-center">
                                     Time Metrics
                                    </h4>
                                    <ul className="space-y-1 sm:space-y-2 text-blue-700 dark:text-blue-300 text-sm">
                                        <li>• Daily deep work hours completed</li>
                                        <li>• Average session length</li>
                                        <li>• Time to reach focused state</li>
                                        <li>• Longest uninterrupted session</li>
                                        <li>• Weekly deep work consistency</li>
                                    </ul>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 p-4 sm:p-6 rounded-lg border border-green-200 dark:border-green-800">
                                    <h4 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-green-800 dark:text-green-300 flex items-center">
                                     Quality Metrics
                                    </h4>
                                    <ul className="space-y-1 sm:space-y-2 text-green-700 dark:text-green-300 text-sm">
                                        <li>• Tasks completed per session</li>
                                        <li>• Quality rating of work produced</li>
                                        <li>• Number of revisions needed</li>
                                        <li>• Complex problems solved</li>
                                        <li>• Creative breakthroughs achieved</li>
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    </div>

{/*  Related Articles  */}
<section className="bg-gray-100 dark:bg-gray-800/50 py-12 sm:py-16">
    <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-900 dark:text-white">
                Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {/*  Article 1  */}
                <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-xl dark:hover:shadow-xl hover:-translate-y-2">
                    <Link to="/blog2" className="block h-full">
                        <div className="relative overflow-hidden h-48 sm:h-56 bg-gray-200 dark:bg-gray-700">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                             alt="Focus and concentration techniques" 
                             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-4 sm:p-6 flex flex-col h-full">
                            <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                7 Science-Backed Methods to Eliminate Distractions
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base flex-grow">
                                Discover how to enter and maintain peak performance states for maximum productivity.
                            </p>
                            <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors duration-300 text-sm sm:text-base inline-flex items-center gap-2">
                                Read More 
                                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </span>
                        </div>
                    </Link>
                </article>

                {/*  Article 2  */}
                <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-xl dark:hover:shadow-xl hover:-translate-y-2">
                    <Link to="/blog2" className="block h-full">
                        <div className="relative overflow-hidden h-48 sm:h-56 bg-gray-200 dark:bg-gray-700">
                            <img src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                             alt="Time management and planning" 
                             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-4 sm:p-6 flex flex-col h-full">
                            <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                The 2-Minute Rule That Will Transform Your Day
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base flex-grow">
                                Learn how to optimize your mental resources for better focus and learning.
                            </p>
                            <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors duration-300 text-sm sm:text-base inline-flex items-center gap-2">
                                Read More 
                                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </span>
                        </div>
                        </Link>
                </article>

                {/*  Article 3  */}
                <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-xl dark:hover:shadow-xl hover:-translate-y-2 md:col-span-2 lg:col-span-1">
                    <Link to="/blog2" className="block h-full">
                        <div className="relative overflow-hidden h-48 sm:h-56 bg-gray-200 dark:bg-gray-700">
                            <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                             alt="Email management and organization" 
                             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-4 sm:p-6 flex flex-col h-full">
                            <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                Inbox Zero: Master Email in 15 Minutes Daily
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base flex-grow">
                                Create boundaries with technology to reclaim your attention and focus.
                            </p>
                            <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors duration-300 text-sm sm:text-base inline-flex items-center gap-2">
                                Read More 
                                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </span>
                        </div>
                        </Link>
                </article>
            </div>
        </div>
    </div>
</section>
    </>
  );
};

export default Blog1;