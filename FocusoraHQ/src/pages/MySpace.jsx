import React, { useState, useEffect } from "react";
import Pomodoro from "../components/Pomodoro";
import Notes from "../components/Notes";
import Todo from "../components/Todo";
import FocusPlaylist from "../components/FocusPlaylist";
import BackgroundSelector from "../components/BackgroundSelector";

const MySpace = () => {
  const [bgPanelOpen, setBgPanelOpen] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    icon: "✅",
    title: "Success",
    message: "Action completed",
  });

  // Load saved background on mount
  useEffect(() => {
    const savedBg = localStorage.getItem("myspace_background");
    if (savedBg) {
      document.body.style.backgroundImage = `url('${savedBg}')`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
    } else {
      // Default background
      document.body.style.backgroundImage = "url(https://marketplace.canva.com/EAFekpb5NK0/1/0/1600w/canva-dark-modern-photo-mountain-and-sky-desktop-wallpaper-5ixgVU5XGxc.jpg)";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.backgroundImage = "";
    };
  }, []);

  const addNotification = (message, title = "Success", icon = "✅") => {
    setNotification({ show: true, icon, title, message });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  useEffect(() => {
    const sel = document.querySelector('footer, .footer, #footer, .site-footer');
    if (!sel) return;
    const prev = sel.style.display;
    sel.style.display = 'none';
    return () => {
      try { sel.style.display = prev || ''; } catch (e) { /* ignore */ }
    };
  }, []);

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, show: false }));
  };

  return (
    <div className="min-h-screen w-screen overflow-x-hidden pb-6">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 pb-4 pt-16 sm:pt-18 md:pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 sm:gap-5 md:gap-6 lg:gap-8 max-w-7xl mx-auto items-stretch">
          {/* Pomodoro Timer - Add min-height on small screens */}
          <div className="xl:col-span-3 md:col-span-2 min-h-[500px] md:min-h-0">
            <div className="h-full">
              <Pomodoro addNotification={addNotification} />
            </div>
          </div>

          {/* Notes Section */}
          <div className="xl:col-span-5 md:col-span-2 min-h-[500px] md:min-h-0">
            <div className="h-full">
              <Notes addNotification={addNotification} />
            </div>
          </div>

          {/* To-Do List */}
          <div className="xl:col-span-4 md:col-span-2 min-h-[500px] md:min-h-0">
            <div className="h-full">
              <Todo addNotification={addNotification} />
            </div>
          </div>
        </div>
      </div>

      {/* Spotify Player (match card container width and slightly smaller) */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-6xl">
        <FocusPlaylist
          addNotification={addNotification}
          bgPanelOpen={bgPanelOpen}
          setBgPanelOpen={setBgPanelOpen}
        />
      </div>

      {/* Background Selector Panel */}
      <BackgroundSelector
        bgPanelOpen={bgPanelOpen}
        setBgPanelOpen={setBgPanelOpen}
        addNotification={addNotification}
      />

      {/* Notification Toast */}
      <div
        className={`fixed top-20 sm:top-24 right-3 sm:right-4 md:right-6 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-lg border border-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-xl transform transition-transform duration-500 z-50 max-w-[calc(100vw-1.5rem)] sm:max-w-sm ${
          notification.show ? "translate-x-0" : "translate-x-[200%]"
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xl sm:text-2xl flex-shrink-0">{notification.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="text-white font-semibold text-sm sm:text-base truncate">
              {notification.title}
            </div>
            <div className="text-white/80 text-xs sm:text-sm line-clamp-2">
              {notification.message}
            </div>
          </div>
          <button
            onClick={hideNotification}
            className="text-white/60 hover:text-white transition flex-shrink-0 text-sm sm:text-base"
          >
            ✖
          </button>
        </div>
      </div>
    </div>
  );
};

export default MySpace;
