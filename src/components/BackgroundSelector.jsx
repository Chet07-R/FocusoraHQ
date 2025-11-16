import React from "react";

const BackgroundSelector = ({ bgPanelOpen, setBgPanelOpen, addNotification }) => {
  const backgrounds = [
    { name: "Serene Garden", emoji: "🌿", url: "https://images.pexels.com/photos/158063/bellingrath-gardens-alabama-landscape-scenic-158063.jpeg" },
    { name: "Majestic Mountains", emoji: "🏔️", url: "https://images.pexels.com/photos/772803/pexels-photo-772803.jpeg" },
    { name: "Peaceful Waterfall", emoji: "💧", url: "https://images.pexels.com/photos/2150347/pexels-photo-2150347.jpeg" },
    { name: "Tranquil Beach", emoji: "🏖️", url: "https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg" },
    { name: "Calm Lake", emoji: "🌊", url: "https://images.pexels.com/photos/761517/pexels-photo-761517.jpeg" },
    { name: "Forest Path", emoji: "🌲", url: "https://images.pexels.com/photos/1166644/pexels-photo-1166644.jpeg" },
    { name: "City Sunset", emoji: "🌆", url: "https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg" },
    { name: "Starry Night", emoji: "🌌", url: "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg" },
  ];

  const changeBackground = (url) => {
    document.body.style.backgroundImage = `url('${url}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
    localStorage.setItem("myspace_background", url);
    addNotification("🎨 Background changed");
    setBgPanelOpen(false);
  };

  return (
    <div
      className={`fixed bottom-36 left-1/2 transform -translate-x-1/2 w-96 max-w-[90vw] max-h-[80vh] rounded-2xl bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-xl border border-white/20 shadow-xl p-5 transition-all duration-500 z-50 overflow-hidden ${
        bgPanelOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <span className="text-xl">🎨</span> Choose Ambience
        </h3>
        <button
          onClick={() => setBgPanelOpen(false)}
          className="text-white text-lg hover:text-red-400 transition"
        >
          ✖
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3 max-h-[36vh] overflow-y-auto pr-1">
        {backgrounds.map((bg, index) => (
          <button
            key={index}
            onClick={() => changeBackground(bg.url)}
            className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition flex items-center gap-2"
          >
            {bg.emoji} <span>{bg.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BackgroundSelector;
