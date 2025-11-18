// src/components/BackgroundSelector.jsx
import React from "react";

const backgrounds = [
  { name: "Mountains", emoji: "🏔️", url: "https://images.pexels.com/photos/772803/pexels-photo-772803.jpeg" },
  { name: "Beach", emoji: "🏖️", url: "https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg" },
  { name: "Night Sky", emoji: "🌌", url: "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg" },
  { name: "Forest", emoji: "🌿", url: "https://images.pexels.com/photos/158063/bellingrath-gardens-alabama-landscape-scenic-158063.jpeg" },
  { name: "Waterfall", emoji: "💧", url: "https://images.pexels.com/photos/2150347/pexels-photo-2150347.jpeg" },
  { name: "Lake", emoji: "🌊", url: "https://images.pexels.com/photos/761517/pexels-photo-761517.jpeg" },
  { name: "Desert", emoji: "🏜️", url: "https://images.pexels.com/photos/1209978/pexels-photo-1209978.jpeg" },
  { name: "Sunset", emoji: "🌅", url: "https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg" },
];

const BackgroundSelector = ({ bgPanelOpen, setBgPanelOpen, addNotification }) => {
  const changeBackground = (url, name) => {
    document.body.style.backgroundImage = `url('${url}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
    localStorage.setItem("myspace_background", url);
    addNotification(`🎨 Ambience changed to ${name}`);
    setBgPanelOpen(false);
  };

  return (
    <div
      className={`fixed bottom-0 left-0 w-full max-w-full rounded-t-2xl md:rounded-2xl md:left-1/2 md:bottom-36 md:transform md:-translate-x-1/2 md:w-96 max-w-[90vw]
        bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-xl border border-white/20 shadow-xl p-4 md:p-5 transition-all duration-500 z-50 ${
        bgPanelOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <span className="text-xl">🌈</span> Choose Your Ambience
        </h3>
        <button
          onClick={() => setBgPanelOpen(false)}
          className="text-white text-lg hover:text-red-400 transition"
        >
          ✖
        </button>
      </div>

      {/* Responsive grid for background buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {backgrounds.map((bg) => (
          <button
            key={bg.name}
            onClick={() => changeBackground(bg.url, bg.name)}
            className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white flex items-center gap-2"
          >
            <span className="text-xl">{bg.emoji}</span>
            <span>{bg.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BackgroundSelector;
