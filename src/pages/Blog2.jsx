import React from 'react';
import { Link } from 'react-router-dom';
import '../components/blog.css';

const Blog2 = () => {
  return (
    <>
      {}
      <article className="py-6 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mt-8 text-center mb-8 sm:mb-12">
              {}
              <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full">Productivity</span>
                <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full">Time Management</span>
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full">Life Hack</span>
              </div>

              {}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight px-4 sm:px-0">
                The 2‑Minute Rule That Will Transform Your Day
              </h1>

              {}
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 font-light px-4 sm:px-0">
                Stop procrastination and build momentum with a simple habit used by top performers.
              </p>

              {}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6 sm:mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-[0_0_0_4px_rgba(59,130,246,0.15)]">
                    <span className="text-white font-bold text-sm sm:text-base">DA</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">David Allen</div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Productivity Expert</div>
                  </div>
                </div>

                <div className="hidden sm:block text-gray-400 dark:text-gray-500">- </div>

                <div className="flex items-center space-x-4 sm:space-x-6">
                  <div className="text-gray-600 dark:text-gray-400 text-center">
                    <div className="text-xs sm:text-sm uppercase tracking-wider">Published</div>
                    <div className="font-medium text-sm sm:text-base">Sep 6, 2025</div>
                  </div>
                  <div className="text-gray-400 dark:text-gray-500">- </div>
                  <div className="text-gray-600 dark:text-gray-400 text-center">
                    <div className="text-xs sm:text-sm uppercase tracking-wider">Read time</div>
                    <div className="font-medium text-sm sm:text-base">12 min</div>
                  </div>
                </div>
              </div>

              {}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-1 drop-shadow-[0_0_12px_rgba(59,130,246,0.35)]">76%</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Productivity Increase</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400 mb-1 drop-shadow-[0_0_12px_rgba(147,51,234,0.35)]">15</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Day Transformation</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold text-green-600 dark:text-green-400 mb-1 drop-shadow-[0_0_12px_rgba(34,197,94,0.35)]">95%</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <div className="container mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-12 max-w-7xl mx-auto">
          {}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl p-4 sm:p-6 lg:sticky lg:top-24 border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
                Table of Contents
              </h3>

              <div className="space-y-1 relative pl-4">
                <a href="#what-is" className="toc-link block py-2 px-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors text-xs sm:text-sm font-medium">
                  What Is The 2-Minute Rule?
                </a>
                <a href="#why-works" className="toc-link block py-2 px-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors text-xs sm:text-sm font-medium">
                  Why It Works
                </a>
                <a href="#benefits" className="toc-link block py-2 px-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors text-xs sm:text-sm font-medium">
                  Key Benefits
                </a>
                <a href="#how-implement" className="toc-link block py-2 px-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors text-xs sm:text-sm font-medium">
                  How to Implement
                </a>
                <a href="#examples" className="toc-link block py-2 px-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors text-xs sm:text-sm font-medium">
                  Real Examples
                </a>
                <a href="#challenges" className="toc-link block py-2 px-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors text-xs sm:text-sm font-medium">
                  Overcoming Challenges
                </a>
                <a href="#conclusion" className="toc-link block py-2 px-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md transition-colors text-xs sm:text-sm font-medium">
                  Conclusion
                </a>
              </div>
            </div>
          </div>

          {}
          <article className="lg:col-span-3 order-1 lg:order-2">
            <div className="max-w-4xl">
              {}
              <div className="space-y-8">
                {}
                <section id="what-is" className="scroll-mt-24">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    What Is The 2-Minute Rule?
                  </h2>
                  <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                    The 2-minute rule is a deceptively simple productivity principle created by David Allen, author of the groundbreaking book "Getting Things Done." The rule is elegantly straightforward:
                  </p>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 sm:p-6 lg:p-8 rounded-r-lg my-6 sm:my-8">
                    <p className="text-lg sm:text-xl font-bold text-yellow-900 dark:text-yellow-100">
                      If a task takes less than two minutes to complete, do it immediately.
                    </p>
                  </div>
                  <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-gray-700 dark:text-gray-300">
                    This seemingly simple principle is based on a fundamental truth: the time and mental energy required to organize, track, and remember a small task often exceeds the time it takes to simply complete it. By tackling these quick wins immediately, you eliminate mental clutter and build momentum throughout your day.
                  </p>
                </section>

                {}
                <section id="why-works" className="scroll-mt-24">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    Why The 2-Minute Rule Works
                  </h2>
                  <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
                    Understanding the psychology behind this rule helps explain its effectiveness:
                  </p>

                  <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 sm:p-6 border-l-4 border-blue-500 dark:border-blue-400">
                      <h3 className="font-bold text-lg text-blue-900 dark:text-blue-200 mb-2">Reduces Cognitive Load</h3>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        Every incomplete task occupies space in your working memory. By completing small tasks immediately, you free up mental resources for complex, high-value work that requires deep focus.
                      </p>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 sm:p-6 border-l-4 border-purple-500 dark:border-purple-400">
                      <h3 className="font-bold text-lg text-purple-900 dark:text-purple-200 mb-2">Eliminates The Zeigarnik Effect</h3>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        Our brains naturally remember unfinished tasks more than completed ones. This creates persistent mental tension. Completing quick tasks breaks this pattern and provides psychological relief.
                      </p>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 sm:p-6 border-l-4 border-green-500 dark:border-green-400">
                      <h3 className="font-bold text-lg text-green-900 dark:text-green-200 mb-2">Builds Momentum</h3>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        Small wins create psychological momentum. Each completed task triggers a small dopamine release, encouraging you to tackle the next one. This creates a positive feedback loop throughout your day.
                      </p>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 sm:p-6 border-l-4 border-orange-500 dark:border-orange-400">
                      <h3 className="font-bold text-lg text-orange-900 dark:text-orange-200 mb-2">Saves Time Overall</h3>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        The time spent adding tasks to lists, checking them later, and deciding when to tackle them actually exceeds the time needed to complete them immediately. You're essentially investing 30 seconds now to save 5 minutes of future management.
                      </p>
                    </div>
                  </div>
                </section>

                {}
                <section id="benefits" className="scroll-mt-24">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    Key Benefits of The 2-Minute Rule
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">Improved Productivity</h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        Complete more tasks in less time by removing the friction of task management and decision fatigue.
                      </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">Reduced Stress & Anxiety</h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        Fewer incomplete tasks mean less mental baggage and reduced anxiety about things you need to do.
                      </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">Better Focus</h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        With fewer mental distractions, you can focus deeper on important work that truly matters.
                      </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">Increased Confidence</h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        More completed tasks build confidence and self-efficacy, encouraging you to tackle bigger challenges.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 sm:p-8 border border-green-200 dark:border-green-800">
                    <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                      <span className="font-bold text-green-800 dark:text-green-200">Real Talk:</span> Most people who implement the 2-minute rule report completing 40-60% more tasks within their first week, all while feeling less stressed and more in control.
                    </p>
                  </div>
                </section>

                {}
                <section id="how-implement" className="scroll-mt-24">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    How to Implement The 2-Minute Rule
                  </h2>

                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Identify 2-Minute Tasks</h3>
                        <p className="text-base text-gray-700 dark:text-gray-300">
                          Get familiar with what takes approximately 2 minutes. Start conservative - if you think it might take longer, it probably will. Quick emails, brief replies, organizing one shelf - these are great examples.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Do It Immediately</h3>
                        <p className="text-base text-gray-700 dark:text-gray-300">
                          When a task appears, don't add it to your to-do list - do it right away. This is the core of the rule. Resist the urge to "get back to it later."
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Use a Timer</h3>
                        <p className="text-base text-gray-700 dark:text-gray-300">
                          For the first week, use a timer to calibrate your time estimation. You'll quickly learn what actually takes 2 minutes versus what you thought would.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Track Your Progress</h3>
                        <p className="text-base text-gray-700 dark:text-gray-300">
                          Keep a simple count of how many 2-minute tasks you complete daily. Seeing the number grow is incredibly motivating and helps establish the habit.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">5</div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Build the Habit</h3>
                        <p className="text-base text-gray-700 dark:text-gray-300">
                          It takes about 21 days to form a habit. Stick with the rule consistently, and it will become automatic. You won't have to think about it anymore.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {}
                <section id="examples" className="scroll-mt-24">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    Real-World Examples
                  </h2>

                  <div className="space-y-4 mb-8">
                    <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4 sm:p-6 border-l-4 border-cyan-500">
                      <p className="font-bold text-cyan-900 dark:text-cyan-200 mb-2">Quick Email</p>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        Reply to that quick question from a colleague. 90 seconds. Do it now instead of adding it to your to-do list.
                      </p>
                    </div>

                    <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4 sm:p-6 border-l-4 border-cyan-500">
                      <p className="font-bold text-cyan-900 dark:text-cyan-200 mb-2">Return a Call</p>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        That voicemail needs a response. Make the call now. It'll take 2 minutes, and you'll feel relief immediately.
                      </p>
                    </div>

                    <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4 sm:p-6 border-l-4 border-cyan-500">
                      <p className="font-bold text-cyan-900 dark:text-cyan-200 mb-2">Pay a Bill</p>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        Got a bill to pay? Do it immediately while you have it in front of you. Takes 2 minutes, saves you mental load.
                      </p>
                    </div>

                    <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4 sm:p-6 border-l-4 border-cyan-500">
                      <p className="font-bold text-cyan-900 dark:text-cyan-200 mb-2">Organize Your Space</p>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        Put those books on the shelf. File those papers. Organize your desk drawer. 2 minutes, done, and your space feels better.
                      </p>
                    </div>

                    <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4 sm:p-6 border-l-4 border-cyan-500">
                      <p className="font-bold text-cyan-900 dark:text-cyan-200 mb-2">Send a Text</p>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        That friend has been on your mind. Send them a quick message. Doesn't take long, makes their day better.
                      </p>
                    </div>
                  </div>
                </section>

                {}
                <section id="challenges" className="scroll-mt-24">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    Overcoming Common Challenges
                  </h2>

                  <div className="space-y-6">
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 sm:p-6 border-l-4 border-red-500">
                      <h3 className="font-bold text-lg text-red-900 dark:text-red-200 mb-3">Challenge: "I Don't Have Time"</h3>
                      <p className="text-base text-gray-700 dark:text-gray-300 mb-3">
                        If you truly don't have time for 2 minutes, you don't have time to add it to a list and deal with it later. The rule actually saves time overall.
                      </p>
                      <p className="text-sm italic text-gray-600 dark:text-gray-400">
                        Solution: View this as an investment that pays returns in focus and reduced mental load.
                      </p>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 sm:p-6 border-l-4 border-red-500">
                      <h3 className="font-bold text-lg text-red-900 dark:text-red-200 mb-3">Challenge: "Breaking Deep Work"</h3>
                      <p className="text-base text-gray-700 dark:text-gray-300 mb-3">
                        Won't stopping for 2 minutes break your deep work flow? Not if you use boundaries.
                      </p>
                      <p className="text-sm italic text-gray-600 dark:text-gray-400">
                        Solution: Apply the rule only during natural breaks, lunch, or designated "inbox times" between focus blocks.
                      </p>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 sm:p-6 border-l-4 border-red-500">
                      <h3 className="font-bold text-lg text-red-900 dark:text-red-200 mb-3">Challenge: "Scope Creep"</h3>
                      <p className="text-base text-gray-700 dark:text-gray-300 mb-3">
                        What if something you thought was 2 minutes actually takes 10?
                      </p>
                      <p className="text-sm italic text-gray-600 dark:text-gray-400">
                        Solution: Use a timer. If you hit 2 minutes and it's not done, stop and schedule it properly. You'll get better at estimation over time.
                      </p>
                    </div>
                  </div>
                </section>

                {}
                <section id="conclusion" className="scroll-mt-24">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    Conclusion: Transform Your Day Starting Now
                  </h2>

                  <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
                    The 2-minute rule is elegantly simple because it works with human psychology rather than against it. You're not fighting procrastination with willpower. You're eliminating the very friction that causes procrastination in the first place.
                  </p>

                  <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
                    By implementing this one simple habit, you'll:
                  </p>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">Complete 40-60% more tasks in your typical week</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">Experience significantly less stress and mental clutter</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">Maintain better focus on your deep, important work</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">Build unstoppable momentum throughout your day</span>
                    </li>
                  </ul>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 sm:p-8 border border-purple-200 dark:border-purple-800">
                    <p className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                      Start today. Right now.
                    </p>
                    <p className="text-base text-gray-700 dark:text-gray-300">
                      Look around. Is there a 2-minute task you've been putting off? Do it now. Feel that relief? That's the power of the 2-minute rule. Keep the momentum going, and watch your productivity soar.
                    </p>
                  </div>
                </section>
              </div>

              {}
              <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 lg:mb-16 shadow-lg dark:shadow-2xl border border-blue-100 dark:border-blue-800">
                <div className="text-center space-y-4 sm:space-y-6">
                  <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 italic">
                    "If a task takes less than two minutes to complete, do it immediately."
                  </p>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    — David Allen, Getting Things Done
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      {}
      <section className="bg-gray-100 dark:bg-gray-800/50 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-900 dark:text-white">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {}
              <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-xl dark:hover:shadow-xl hover:-translate-y-2">
                <Link to="/blog1" className="block h-full">
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </span>
                  </div>
                </Link>
              </article>

              {}
              <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-xl dark:hover:shadow-xl hover:-translate-y-2">
                <Link to="/blog1" className="block h-full">
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </span>
                  </div>
                </Link>
              </article>

              {}
              <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-xl dark:hover:shadow-xl hover:-translate-y-2 md:col-span-2 lg:col-span-1">
                <Link to="/blog1" className="block h-full">
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
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

export default Blog2;
