import React, { useEffect } from "react";

const backgrounds = [
  { name: "Mountains", url: "https://images.pexels.com/photos/772803/pexels-photo-772803.jpeg" },
  { name: "Beach", url: "https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg" },
  { name: "Night Sky", url: "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg" },
  { name: "Forest", url: "https://images.pexels.com/photos/158063/bellingrath-gardens-alabama-landscape-scenic-158063.jpeg" },
  { name: "Waterfall", url: "https://images.pexels.com/photos/2150347/pexels-photo-2150347.jpeg" },
  { name: "Lake", url: "https://images.pexels.com/photos/761517/pexels-photo-761517.jpeg" },
  { name: "Desert", url: "https://images.pexels.com/photos/1209978/pexels-photo-1209978.jpeg" },
  { name: "Sunset", url: "https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg" },
];

const BackgroundSelector = ({ bgPanelOpen, setBgPanelOpen, addNotification }) => {
  useEffect(() => {
    if (bgPanelOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [bgPanelOpen]);

  const changeBackground = (url, name) => {
    document.body.style.backgroundImage = `url('${url}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
    localStorage.setItem("myspace_background", url);
    localStorage.setItem("myspace_background_source", "manual");
    localStorage.setItem("myspace_background_name", name);

    window.dispatchEvent(
      new CustomEvent("myspace-background-changed", {
        detail: {
          name,
          url,
          source: "manual",
        },
      })
    );

    addNotification(`Ambience changed to ${name}`);
    setBgPanelOpen(false);
  };

  return (
    <div
      className={`fixed bottom-3 left-3 right-3 sm:left-4 sm:right-4 md:left-1/2 md:right-auto md:bottom-36 md:transform md:-translate-x-1/2 md:w-96 max-h-[80vh] overflow-y-auto rounded-2xl
        bg-white/95 dark:bg-gray-900/95 text-slate-800 dark:text-white backdrop-blur-2xl border border-slate-200/80 dark:border-white/20 shadow-2xl p-4 md:p-5 transition-all duration-300 z-[11080] ${
        bgPanelOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-base sm:text-lg text-slate-800 dark:text-white">
          Choose Your Ambience
        </h3>
        <button
          type="button"
          onClick={() => setBgPanelOpen(false)}
          className="text-slate-500 hover:text-slate-800 dark:text-gray-300 dark:hover:text-red-400 text-lg transition cursor-pointer p-1"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {backgrounds.map((bg) => (
          <button
            type="button"
            key={bg.name}
            onClick={() => changeBackground(bg.url, bg.name)}
            className="w-full text-left px-4 py-2.5 sm:py-3 bg-slate-100 hover:bg-slate-200/80 dark:bg-white/10 dark:hover:bg-white/20 rounded-xl text-slate-800 dark:text-white font-medium text-sm transition flex items-center justify-between cursor-pointer border border-slate-200/60 dark:border-white/5"
          >
            <span>{bg.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BackgroundSelector;