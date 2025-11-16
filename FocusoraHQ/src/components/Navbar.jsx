import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, signOutUser } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Shared classes for link text with hover and focus gradient underline
  // Keep nav text white on hover; only animate the underline (after:)
  const linkTextClasses =
    "nav-text relative text-white transition-all duration-300 focus:outline-none after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-blue-600 after:transition-all after:duration-300 hover:after:w-full focus:after:w-full";

  // Handle logo click - scroll to top if on home page, navigate if on other page
  const handleLogoClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest("#profile-menu") &&
        !e.target.closest("#profile-icon")
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Nav items array (external or internal links with icons)
  const navItems = [
    { name: "My Space", to: "/my-space", icon: "mail", isExternal: false, dataPage: "my_space" },
    { name: "Study Room", to: "/study-room", icon: "book", dataPage: "study_room" },
    // Use internal React route for Blogs so it matches App.jsx routes
    { name: "Blogs", to: "/blog", icon: "note", dataPage: "Blog" },
    { name: "Leaderboard", to: "/leaderboard", icon: "star", dataPage: "leaderboard" },
  ];

  // Render icon SVG based on icon type
  const renderIcon = (icon) => {
    switch (icon) {
      case "mail":
        return (
          <svg
            className="w-5 h-5 group-hover:scale-110 text-pink-400 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m7 7 5 5 5-5"
            />
          </svg>
        );
      case "book":
        return (
          <svg
            className="w-5 h-5 group-hover:scale-110 text-purple-400 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        );
      case "note":
        return (
          <svg
            className="w-5 h-5 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        );
      case "star":
        return (
          <svg
            className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform duration-300"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2.5l2.9 5.9 6.6.9-4.8 4.7 1.1 6.6L12 17.8l-5.8 3.1 1.1-6.6-4.8-4.7 6.6-.9L12 2.5z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="w-full backdrop-blur-md h-16 flex text-white justify-between items-center px-4 lg:px-6 fixed z-50">
      {/* Logo Section */}
      <Link 
        to="/" 
        onClick={handleLogoClick}
        className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-300"
      >
        <img src="/images/logo-shrinked.png" className="w-8 h-8" alt="FocusoraHQ Lamp Logo" />
        <span className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent brand-gradient" style={{ letterSpacing: "-0.5px" }}>
          FocusoraHQ
        </span>
      </Link>

      {/* Desktop Nav Links */}
      <div className="hidden lg:flex gap-10 items-center font-semibold text-base">
        {navItems.map((item) =>
          item.isExternal ? (
            <a
              key={item.name}
              href={item.href}
              data-page={item.dataPage}
              className="nav-link flex items-center gap-2 cursor-pointer group"
            >
              {renderIcon(item.icon)}
              <span className={linkTextClasses}>{item.name}</span>
            </a>
          ) : (
            <NavLink
              key={item.name}
              to={item.to}
              data-page={item.dataPage}
              className={({ isActive }) =>
                `nav-link flex items-center gap-2 cursor-pointer group${isActive ? " active" : ""}`
              }
            >
              {renderIcon(item.icon)}
              <span className={linkTextClasses}>{item.name}</span>
            </NavLink>
          )
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          id="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors duration-300 ${
            mobileMenuOpen ? "active" : ""
          }`}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 18h18" />
              </>
            )}
          </svg>
        </button>

        {/* Sign In Button (when not logged in) or Profile Dropdown (when logged in) */}
        {user ? (
          <div className="relative">
            <div
              id="profile-icon"
              onClick={() => setProfileOpen(!profileOpen)}
              className="profile-ring cursor-pointer w-10 h-10 rounded-full overflow-hidden"
            >
              <img
                src="/images/Profile_Icon.png"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

          {profileOpen && (
            <div
              id="profile-menu"
              className="absolute right-0 top-12 z-50 w-72 rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 profile-panel overflow-hidden ring-1 ring-black/5 dark:ring-white/10 animate-slideInUp"
            >
              {/* Profile Header */}
              <div className="flex p-4 items-center gap-3 profile-gradient-header">
                <div className="profile-ring w-11 h-11 p-1">
                  <img
                    src="/images/Profile_img.png"
                    className="w-full h-full object-cover rounded-full"
                    alt="Profile"
                  />
                </div>
                <div className="min-w-0">
                  <p className="profile-name truncate">{user?.displayName || 'User'}</p>
                  <p className="profile-email text-sm truncate">{user?.email || 'Not signed in'}</p>
                </div>
              </div>

              <div className="dropdown-divider"></div>

              {/* Menu Items */}
              <div className="py-1 space-y-1">
                <a
                  href="/pages/profile.html"
                  className="menu-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all group focus:outline-none"
                >
                  <svg
                    className="menu-icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z" />
                    <path d="M20 21a8 8 0 0 0-16 0" />
                  </svg>
                  <span className="text-hover-wrap text-gray-700 dark:text-gray-200 font-medium">
                    Profile
                  </span>
                </a>
                <Link
                  to="/community"
                  className="menu-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all group focus:outline-none"
                >
                  <svg
                    className="menu-icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
                    <path d="M7 14a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
                    <path d="M5 20a7 7 0 0 1 7-7" />
                    <path d="M16 21a5 5 0 0 1 5-5" />
                  </svg>
                  <span className="text-hover-wrap text-gray-700 dark:text-gray-200 font-medium">
                    Community
                  </span>
                </Link>
              </div>

              <div className="dropdown-divider"></div>

              {/* Theme Toggle */}
              <div className="flex items-center justify-between px-4 py-3">
                <span className="theme-label">Theme</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={darkMode}
                  aria-label="Toggle dark mode"
                  onClick={toggleDarkMode}
                  className={`theme-toggle ${
                    darkMode ? "on" : ""
                  } focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2`}
                >
                  <span className={`toggle-knob ${darkMode ? "on" : ""}`} />
                </button>
              </div>

              <div className="dropdown-divider"></div>

              {/* Logout */}
              <div className="px-4 py-2">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to log out?')) {
                      signOutUser();
                      setProfileOpen(false);
                    }
                  }}
                  className="w-full text-left menu-item logout-btn flex items-center gap-3 p-3 rounded-xl text-red-600 dark:text-red-400 transition-all group focus:outline-none"
                >
                  <svg
                    className="menu-icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <path d="M16 17l5-5-5-5" />
                    <path d="M21 12H9" />
                  </svg>
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
        ) : (
          <Link
            to="/signin"
            className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold px-6 py-2 rounded-lg hover:from-purple-500 hover:to-cyan-500 transform hover:scale-105 transition-all duration-300"
          >
            Sign In
          </Link>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="absolute top-16 left-0 w-full bg-black/95 backdrop-blur-md z-40 transition-all duration-300 lg:hidden">
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) =>
              item.isExternal ? (
                <a
                  key={item.name}
                  href={item.href}
                  data-page={item.dataPage}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-white font-semibold"
                >
                  {renderIcon(item.icon)}
                  <span className="text-white font-semibold">{item.name}</span>
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.to}
                  data-page={item.dataPage}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg transition-colors duration-300 text-white font-semibold group hover:bg-gray-800 focus:outline-none focus:bg-gray-800"
                >
                  {renderIcon(item.icon)}
                  <span>{item.name}</span>
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
