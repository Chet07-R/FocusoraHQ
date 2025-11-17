import React from "react";

const backgrounds = [
  { name: "Mountains", emoji: "🏔️", url: "https://images.pexels.com/photos/772803/pexels-photo-772803.jpeg" },
  { name: "Beach", emoji: "🏖️", url: "https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg" },
  { name: "Night", emoji: "🌌", url: "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg" },
  { name: "Garden", emoji: "🌿", url: "https://images.pexels.com/photos/158063/bellingrath-gardens-alabama-landscape-scenic-158063.jpeg" },
  { name: "Waterfall", emoji: "💧", url: "https://images.pexels.com/photos/2150347/pexels-photo-2150347.jpeg" },
  { name: "Lake", emoji: "🌊", url: "https://images.pexels.com/photos/761517/pexels-photo-761517.jpeg" },
];

const BackgroundSelector = ({ bgPanelOpen, setBgPanelOpen, addNotification }) => {
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
      className={`fixed bottom-36 left-1/2 transform -translate-x-1/2 w-96 max-w-[90vw] rounded-2xl 
      bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 
      backdrop-blur-xl border border-white/20 shadow-xl p-5 transition-all duration-500 z-50
      ${bgPanelOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-6 pointer-events-none"}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <span className="text-xl">🎨</span> Choose Your Ambience
        </h3>
        <button
          onClick={() => setBgPanelOpen(false)}
          className="text-white text-lg hover:text-red-400 transition"
        >
          ✖
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {backgrounds.map((bg, idx) => (
          <button
            key={idx}
            onClick={() => changeBackground(bg.url)}
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
