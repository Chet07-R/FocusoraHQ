import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, userProfile, signOutUser, loading, hadInitialUser } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const avatarSrc = userProfile?.photoURL ?? user?.photoURL ?? "/images/Profile_Icon.png";

  const linkTextClasses =
    "nav-text relative text-white transition-all duration-300 focus:outline-none after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:to-blue-600 after:transition-all after:duration-300 hover:after:w-full focus:after:w-full";

  const handleLogoClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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

  const navItems = [
    { name: "My Space", to: "/my-space", icon: "mail", isExternal: false, dataPage: "my_space" },
    { name: "Study Room", to: "/study-room", icon: "book", dataPage: "study_room" },
    { name: "Blogs", to: "/blog", icon: "note", dataPage: "Blog" },
    { name: "Leaderboard", to: "/leaderboard", icon: "star", dataPage: "leaderboard" },
  ];

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
      <Link 
        to="/" 
        onClick={handleLogoClick}
        className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-300"
      >
        <img src="/images/logo-shrinked.png" className="w-8 h-8" alt="FocusoraHQ Lamp Logo" />
        <span className="font-bold text-xl brand-gradient" style={{ letterSpacing: "-0.5px" }}>
          FocusoraHQ
        </span>
      </Link>

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

      <div className="flex items-center gap-4">

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

        {user ? (
          <div className="relative">
            <div
              id="profile-icon"
              onClick={() => setProfileOpen(!profileOpen)}
              className="profile-ring cursor-pointer w-10 h-10 rounded-full overflow-hidden"
            >
              <img
                src={avatarSrc}
                onError={(e) => {
                  if (e.currentTarget.src !== "/images/Profile_Icon.png") {
                    e.currentTarget.src = "/images/Profile_Icon.png";
                  }
                }}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

          {profileOpen && (
            <div
              id="profile-menu"
              className="absolute right-0 top-12 z-50 w-72 rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 profile-panel overflow-hidden ring-1 ring-black/5 dark:ring-white/10 animate-slideInUp"
            >

              <div className="flex p-4 items-center gap-3 profile-gradient-header">
                <div className="profile-ring w-11 h-11 p-1">
                  <img
                    src={avatarSrc}
                    onError={(e) => {
                      if (e.currentTarget.src !== "/images/Profile_Icon.png") {
                        e.currentTarget.src = "/images/Profile_Icon.png";
                      }
                    }}
                    className="w-full h-full object-cover rounded-full"
                    alt="Profile"
                  />
                </div>
                <div className="min-w-0">
                  <p className="profile-name truncate">{userProfile?.displayName || user?.displayName || 'User'}</p>
                  <p className="profile-email text-sm truncate">{user?.email || 'Not signed in'}</p>
                </div>
              </div>

              <div className="dropdown-divider"></div>

              <div className="py-1 space-y-1">
                <Link
                  to="/profile"
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
                </Link>
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
        ) : loading ? (
          <div className="w-10 h-10 rounded-full bg-gray-700/60 animate-pulse" aria-hidden="true" />
        ) : (
          <Link
            to="/signin"
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.4), 0 0 40px rgba(139, 92, 246, 0.3), 0 4px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              padding: '10px 20px',
              borderRadius: '10px'
            }}
            className="text-white text-sm font-semibold hover:brightness-110 transform hover:scale-103 transition-all duration-300"
            aria-label="Sign in or sign up"
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 30px rgba(6, 182, 212, 0.6), 0 0 60px rgba(139, 92, 246, 0.5), 0 6px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.4), 0 0 40px rgba(139, 92, 246, 0.3), 0 4px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'}
          >
            <span>Sign In / Sign Up</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, marginTop: '1px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </Link>
        )}
      </div>

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
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 text-white font-semibold group focus:outline-none ${
                    location.pathname === item.to 
                      ? 'bg-white/5 shadow-lg shadow-black/30' 
                      : 'hover:bg-gray-800'
                  }`}
                >
                  {renderIcon(item.icon)}
                  <span className={location.pathname === item.to 
                    ? 'text-white font-bold underline underline-offset-4 decoration-cyan-400 decoration-2'
                    : 'text-white font-semibold'
                  }>{item.name}</span>
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