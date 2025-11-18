import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";

const Careers = () => {
  const { darkMode } = useTheme();
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const benefits = [
    {
      icon: "💰",
      title: "Competitive Salary",
      description: "Industry-leading compensation packages",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: "🏠",
      title: "Remote First",
      description: "Work from anywhere in the world",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: "🏥",
      title: "Health Coverage",
      description: "Comprehensive medical and dental",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "📚",
      title: "Learning Budget",
      description: "$2000/year for professional development",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: "🌴",
      title: "Unlimited PTO",
      description: "Take time off when you need it",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: "🚀",
      title: "Equity Options",
      description: "Be an owner in our success",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const openings = [
    {
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Build beautiful, performant React applications that millions of users will love."
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      description: "Create intuitive user experiences that help people focus and achieve their goals."
    },
    {
      title: "Backend Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Design scalable systems using Node.js, Firebase, and cloud technologies."
    },
    {
      title: "Community Manager",
      department: "Community",
      location: "Remote",
      type: "Full-time",
      description: "Build and nurture our global community of focused learners and professionals."
    },
    {
      title: "Content Writer",
      department: "Marketing",
      location: "Remote",
      type: "Contract",
      description: "Create engaging blog posts, tutorials, and documentation for our users."
    },
    {
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Maintain and improve our infrastructure, CI/CD pipelines, and monitoring systems."
    }
  ];

  const departments = ["all", "Engineering", "Design", "Marketing", "Community"];

  const filteredOpenings = selectedDepartment === "all" 
    ? openings 
    : openings.filter(job => job.department === selectedDepartment);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} pt-20 pb-16`}>
      {}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 py-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Join Our Team
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Help us build the future of focused productivity. Work with passionate people on meaningful problems.
          </p>
        </div>
      </div>

      {}
      <div className="container mx-auto px-6 -mt-16 relative z-20 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl p-6 shadow-2xl transform hover:-translate-y-2 transition-all duration-300`}
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${benefit.color} flex items-center justify-center text-3xl mb-4`}>
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {}
      <div className="container mx-auto px-6 mb-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Why FocusoraHQ?</h2>
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl p-8 md:p-12 shadow-xl`}>
            <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed mb-6`}>
              We're a small, fully remote team building products that genuinely help people. No corporate bureaucracy, no pointless meetings – just smart people working together on problems that matter.
            </p>
            <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed mb-6`}>
              We value deep work, clear communication, and work-life balance. Our async-first culture means you can do your best work on your own schedule.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <span className={`px-4 py-2 ${darkMode ? "bg-gray-700" : "bg-gray-100"} rounded-full`}>
                🌍 Global Team
              </span>
              <span className={`px-4 py-2 ${darkMode ? "bg-gray-700" : "bg-gray-100"} rounded-full`}>
                🚀 Fast Growth
              </span>
              <span className={`px-4 py-2 ${darkMode ? "bg-gray-700" : "bg-gray-100"} rounded-full`}>
                💡 Innovation First
              </span>
              <span className={`px-4 py-2 ${darkMode ? "bg-gray-700" : "bg-gray-100"} rounded-full`}>
                🤝 Collaborative
              </span>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="container mx-auto px-6 mb-24">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Open Positions</h2>
        <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-600"} mb-8`}>
          {filteredOpenings.length} open position{filteredOpenings.length !== 1 ? "s" : ""}
        </p>

        {}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                selectedDepartment === dept
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                  : darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  : "bg-white hover:bg-gray-100 text-gray-700 shadow-md"
              }`}
            >
              {dept === "all" ? "All Roles" : dept}
            </button>
          ))}
        </div>

        {}
        <div className="max-w-4xl mx-auto space-y-6">
          {filteredOpenings.map((job, index) => (
            <div
              key={index}
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{job.title}</h3>
                  <div className="flex flex-wrap gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      darkMode ? "bg-cyan-900/50 text-cyan-400" : "bg-cyan-100 text-cyan-700"
                    }`}>
                      {job.department}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
                    }`}>
                      📍 {job.location}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
                    }`}>
                      ⏰ {job.type}
                    </span>
                  </div>
                </div>
              </div>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} mb-6`}>
                {job.description}
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300">
                Apply Now →
              </button>
            </div>
          ))}
        </div>
      </div>

      {}
      <div className={`container mx-auto px-6`}>
        <div className={`${
          darkMode ? "bg-gradient-to-r from-gray-800 to-gray-900" : "bg-gradient-to-r from-gray-100 to-gray-200"
        } rounded-2xl p-12 text-center`}>
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Don't see a perfect fit?</h3>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-8 max-w-2xl mx-auto text-lg`}>
            We're always looking for talented people. Send us your resume and tell us why you'd be a great addition to the team.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:-translate-y-1"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Careers;
