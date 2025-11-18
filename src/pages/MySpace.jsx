import React, { useState, useEffect } from "react";
import Pomodoro from "../components/Pomodoro";
import Notes from "../components/Notes";
import Todo from "../components/Todo";
import FocusPlaylist from "../components/FocusPlaylist";
import BackgroundSelector from "../components/BackgroundSelector";
import { useTheme } from "../context/ThemeContext";

const MySpace = () => {
  const { darkMode } = useTheme();
  const [bgPanelOpen, setBgPanelOpen] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    icon: "✅",
    title: "Success",
    message: "Action completed",
  });

  
  useEffect(() => {
    const savedBg = localStorage.getItem("myspace_background");
    if (savedBg) {
      document.body.style.backgroundImage = `url('${savedBg}')`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
    } else {
      
      document.body.style.backgroundImage = "url(https://marketplace.canva.com/EAFekpb5NK0/1/0/1600w/canva-dark-modern-photo-mountain-and-sky-desktop-wallpaper-5ixgVU5XGxc.jpg)";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
    }

    
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
      try { sel.style.display = prev || ''; } catch (e) {  }
    };
  }, []);

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, show: false }));
  };

  return (
    <div className="min-h-screen w-screen overflow-x-hidden pb-6">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 pb-4 pt-16 sm:pt-18 md:pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 sm:gap-5 md:gap-6 lg:gap-8 max-w-7xl mx-auto items-stretch">
          {}
          <div className="xl:col-span-3 md:col-span-2 min-h-[500px] md:min-h-0">
            <div className="h-full">
              <Pomodoro addNotification={addNotification} />
            </div>
          </div>

          {}
          <div className="xl:col-span-5 md:col-span-2 min-h-[500px] md:min-h-0">
            <div className="h-full">
              <Notes addNotification={addNotification} />
            </div>
          </div>

          {}
          <div className="xl:col-span-4 md:col-span-2 min-h-[500px] md:min-h-0">
            <div className="h-full">
              <Todo addNotification={addNotification} />
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-6xl">
        <FocusPlaylist
          addNotification={addNotification}
          bgPanelOpen={bgPanelOpen}
          setBgPanelOpen={setBgPanelOpen}
        />
      </div>

      {}
      <BackgroundSelector
        bgPanelOpen={bgPanelOpen}
        setBgPanelOpen={setBgPanelOpen}
        addNotification={addNotification}
      />

      {}
      <div
        className={`fixed top-20 sm:top-24 right-3 sm:right-4 md:right-6 backdrop-blur-lg rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-xl transform transition-transform duration-500 z-50 max-w-[calc(100vw-1.5rem)] sm:max-w-sm ${
          notification.show ? "translate-x-0" : "translate-x-[200%]"
        } ${
          darkMode 
            ? "bg-gradient-to-r from-white/20 to-white/10 border border-white/20" 
            : "bg-gradient-to-r from-purple-100/90 to-cyan-100/90 border border-purple-300/40"
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xl sm:text-2xl flex-shrink-0">{notification.icon}</span>
          <div className="flex-1 min-w-0">
            <div className={`font-semibold text-sm sm:text-base truncate ${
              darkMode ? "text-white" : "text-gray-800"
            }`}>
              {notification.title}
            </div>
            <div className={`text-xs sm:text-sm line-clamp-2 ${
              darkMode ? "text-white/80" : "text-gray-700"
            }`}>
              {notification.message}
            </div>
          </div>
          <button
            onClick={hideNotification}
            className={`transition flex-shrink-0 text-sm sm:text-base ${
              darkMode ? "text-white/60 hover:text-white" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            ✖
          </button>
        </div>
      </div>
    </div>
  );
};

export default MySpace;
