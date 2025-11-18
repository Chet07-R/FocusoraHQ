import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";

const About = () => {
  const { darkMode } = useTheme();

  const stats = [
    { value: "10K+", label: "Active Users", icon: "👥" },
    { value: "50K+", label: "Study Hours", icon: "⏱️" },
    { value: "100+", label: "Countries", icon: "🌍" },
    { value: "4.8/5", label: "User Rating", icon: "⭐" }
  ];

  const values = [
    {
      icon: "🎯",
      title: "Focus First",
      description: "We believe deep focus is the key to achieving excellence. Our tools are designed to eliminate distractions and help you enter flow state.",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: "🤝",
      title: "Community Driven",
      description: "Learning is better together. We foster a supportive community where students and professionals help each other grow.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "🚀",
      title: "Continuous Innovation",
      description: "We're constantly improving based on user feedback. Your success drives our innovation and product development.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: "🔒",
      title: "Privacy Matters",
      description: "Your data is yours. We use industry-leading security practices to protect your information and respect your privacy.",
      color: "from-orange-500 to-red-500"
    }
  ];

  const team = [
    {
      name: "Chetan Ajmani",
      role: "Co-Founder & CEO",
      image: "👨‍💼",
      bio: "",
      color: "from-cyan-500 to-blue-500"
    },
    {
      name: "Tanish Mehta",
      role: "Co-Founder & CTO",
      image: "👩‍💻",
      bio: "",
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Vansh Thakur",
      role: "Head of Product",
      image: "👨‍🎨",
      bio: "",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} pt-20 pb-16`}>
      {}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              About FocusoraHQ
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              We're on a mission to help students and professionals achieve their full potential through focused, distraction-free productivity.
            </p>
          </div>
        </div>
      </div>

      {}
      <div className="container mx-auto px-6 -mt-16 relative z-20 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl p-6 shadow-2xl text-center transform hover:-translate-y-2 transition-all duration-300`}
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {}
      <div className="container mx-auto px-6 mb-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">Our Story</h2>
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl p-8 md:p-12 shadow-xl`}>
            <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed mb-6`}>
              FocusoraHQ was born from a simple frustration: the struggle to maintain focus in an increasingly distracted world. As students ourselves, we experienced firsthand how difficult it was to find the right tools for productive study sessions.
            </p>
            <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed mb-6`}>
              In 2024, we decided to build the solution we wished existed. What started as a simple Pomodoro timer evolved into a comprehensive productivity platform that combines focus techniques, collaborative spaces, and community support.
            </p>
            <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed`}>
              Today, FocusoraHQ serves thousands of students and professionals worldwide, helping them achieve their goals through focused work sessions, productive habits, and a supportive community.
            </p>
          </div>
        </div>
      </div>

      {}
      <div className="container mx-auto px-6 mb-24">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Our Values</h2>
        <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-600"} mb-12 max-w-2xl mx-auto`}>
          These principles guide everything we do at FocusoraHQ
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => (
            <div
              key={index}
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${value.color} flex items-center justify-center text-3xl mb-6`}>
                {value.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed`}>
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {}
      <div className="container mx-auto px-6 mb-24">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Meet Our Team</h2>
        <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-600"} mb-12 max-w-2xl mx-auto`}>
          Passionate individuals working to make productivity accessible to everyone
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {team.map((member, index) => (
            <div
              key={index}
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl p-6 shadow-lg text-center transform hover:-translate-y-2 transition-all duration-300`}
            >
              <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${member.color} flex items-center justify-center text-5xl mx-auto mb-4`}>
                {member.image}
              </div>
              <h3 className="text-xl font-bold mb-1">{member.name}</h3>
              <p className="text-sm text-transparent bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text font-semibold mb-3">
                {member.role}
              </p>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>

      {}
      <div className={`container mx-auto px-6`}>
        <div className={`${
          darkMode ? "bg-gradient-to-r from-gray-800 to-gray-900" : "bg-gradient-to-r from-gray-100 to-gray-200"
        } rounded-2xl p-12 text-center`}>
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Join Our Mission</h3>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-8 max-w-2xl mx-auto text-lg`}>
            Be part of a community that values focus, productivity, and continuous growth.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Started Free
            </Link>
            <Link
              to="/careers"
              className={`px-8 py-4 ${
                darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-50"
              } rounded-lg font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 shadow-md`}
            >
              View Careers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;