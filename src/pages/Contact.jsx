import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import emailjs from '@emailjs/browser';

const Contact = () => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [sending, setSending] = useState(false);

  const showToast = (message, type = "info") => {
    const colors = {
      success: "bg-green-600 text-white",
      error: "bg-red-600 text-white",
      info: "bg-blue-600 text-white"
    };

    const toast = document.createElement("div");
    toast.textContent = message;
    toast.className = `fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-lg z-50 transition-all duration-500 transform opacity-0 translate-y-2 ${colors[type]} font-medium`;

    document.body.appendChild(toast);
    setTimeout(() => toast.classList.remove("opacity-0", "translate-y-2"), 100);
    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-2");
      setTimeout(() => toast.remove(), 500);
    }, 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      showToast("⚠️ Please fill in all required fields", "error");
      return;
    }

    setSending(true);

    
    setTimeout(() => {
      showToast("✅ Message sent successfully! We'll get back to you soon.", "success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSending(false);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactMethods = [
    {
      icon: "📧",
      title: "Email",
      value: "focusorahq@gmail.com",
      description: "Send us an email anytime",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: "💬",
      title: "Live Chat",
      value: "Available 24/7",
      description: "Chat with our support team",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "📱",
      title: "Phone",
      value: "+91 12345-67890",
      description: "Mon-Fri, 9AM-6PM IST",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} pt-20 pb-16`}>
      {}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 py-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-10 relative z-20">
        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl p-6 shadow-lg text-center transform hover:-translate-y-2 transition-all duration-300`}
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${method.color} flex items-center justify-center text-3xl mx-auto mb-4`}>
                {method.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{method.title}</h3>
              <p className="text-lg font-semibold text-transparent bg-gradient-to-r bg-clip-text from-cyan-400 to-pink-400 mb-2">
                {method.value}
              </p>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {method.description}
              </p>
            </div>
          ))}
        </div>

        {}
        <div className="max-w-4xl mx-auto">
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-2xl p-8 md:p-12`}>
            <h2 className="text-3xl font-bold mb-2 text-center">Send us a Message</h2>
            <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-600"} mb-8`}>
              Fill out the form below and our team will get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={`w-full px-4 py-3 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 focus:border-cyan-500"
                        : "bg-gray-50 border-gray-300 focus:border-cyan-500"
                    } border-2 focus:outline-none transition-colors`}
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className={`w-full px-4 py-3 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 focus:border-cyan-500"
                        : "bg-gray-50 border-gray-300 focus:border-cyan-500"
                    } border-2 focus:outline-none transition-colors`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  className={`w-full px-4 py-3 rounded-lg ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 focus:border-cyan-500"
                      : "bg-gray-50 border-gray-300 focus:border-cyan-500"
                  } border-2 focus:outline-none transition-colors`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                  rows="6"
                  className={`w-full px-4 py-3 rounded-lg ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 focus:border-cyan-500"
                      : "bg-gray-50 border-gray-300 focus:border-cyan-500"
                  } border-2 focus:outline-none transition-colors resize-none`}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={sending}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 ${
                  sending
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-lg hover:shadow-cyan-500/50"
                } text-white`}
              >
                {sending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>

          {}
          <div className={`mt-12 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-8 text-center shadow-lg`}>
            <h3 className="text-2xl font-bold mb-4">Office Location</h3>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
              📍 Panchkula, Haryana, India
            </p>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>
              Currently operating remotely. Visit us virtually anytime!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
