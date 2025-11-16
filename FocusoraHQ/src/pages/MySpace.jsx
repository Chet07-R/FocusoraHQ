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
      <div className="container mx-auto px-4 py-8 pb-4 md:ml-4 pt-20">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 max-w-7xl mx-auto items-start">
          {/* Pomodoro Timer */}
          <div className="xl:col-span-3 self-start">
            <Pomodoro addNotification={addNotification} />
          </div>

          {/* Notes Section */}
          <div className="xl:col-span-5 self-start">
            <Notes addNotification={addNotification} />
          </div>

          {/* To-Do List */}
          <div className="xl:col-span-4 self-start">
            <Todo addNotification={addNotification} />
          </div>
        </div>
      </div>

      {/* Spotify Player */}
      <FocusPlaylist
        addNotification={addNotification}
        bgPanelOpen={bgPanelOpen}
        setBgPanelOpen={setBgPanelOpen}
      />

      {/* Background Selector Panel */}
      <BackgroundSelector
        bgPanelOpen={bgPanelOpen}
        setBgPanelOpen={setBgPanelOpen}
        addNotification={addNotification}
      />

      {/* Notification Toast */}
      <div
        className={`fixed top-24 right-6 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 shadow-xl transform transition-transform duration-500 z-50 max-w-sm ${
          notification.show ? "translate-x-0" : "translate-x-[200%]"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{notification.icon}</span>
          <div className="flex-1">
            <div className="text-white font-semibold">{notification.title}</div>
            <div className="text-white/80 text-sm">{notification.message}</div>
          </div>
          <button
            onClick={hideNotification}
            className="text-white/60 hover:text-white transition"
          >
            ✖
          </button>
        </div>
      </div>
    </div>
  );
};

export default MySpace;