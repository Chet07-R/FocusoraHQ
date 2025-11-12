// FocusPlaylist.jsx
import React, { useState } from "react";

const FocusPlaylist = ({ addNotification, bgPanelOpen, setBgPanelOpen }) => {
  const [musicPanelOpen, setMusicPanelOpen] = useState(false);
  const [spotifyUrl, setSpotifyUrl] = useState(
    localStorage.getItem("spotify_playlist") ||
      "https://open.spotify.com/embed/playlist/37i9dQZF1DZ06evO0FDzS8?utm_source=generator"
  );

  const changeMusic = (playlistId) => {
    const newUrl = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`;
    setSpotifyUrl(newUrl);
    localStorage.setItem("spotify_playlist", newUrl);
    addNotification("🎵 Music Changed");
    setMusicPanelOpen(false);
  };

  return (
    <>
      {/* ===== FOCUS PLAYLIST SECTION ===== */}
      <div className="w-full mb-8">
        <div className="bg-gradient-to-r from-black/60 via-gray-900/80 to-black/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg text-white">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎵</span>
                <span className="font-semibold">Focus Playlist</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setMusicPanelOpen(!musicPanelOpen);
                    if (setBgPanelOpen) setBgPanelOpen(false);
                  }}
                  className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition"
                >
                  🎧 Change Music
                </button>
                <button
                  onClick={() => {
                    if (setBgPanelOpen) setBgPanelOpen(!bgPanelOpen);
                    setMusicPanelOpen(false);
                  }}
                  className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition"
                >
                  🌈 Choose Ambience
                </button>
                <span className="text-sm text-white/70">Powered by Spotify</span>
              </div>
            </div>
            <iframe
              id="spotifyPlayer"
              style={{ borderRadius: "12px" }}
              src={spotifyUrl}
              width="100%"
              height="80"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              title="Focus Playlist"
            ></iframe>
          </div>
        </div>
      </div>

      {/* ===== MUSIC SELECTOR PANEL ===== */}
      <div
        className={`fixed bottom-36 left-1/2 transform -translate-x-1/2 w-96 max-w-[90vw] rounded-2xl bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-xl border border-white/20 shadow-xl p-5 transition-all duration-500 z-50 ${
          musicPanelOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-6 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <span className="text-xl">🎵</span> Choose Your Vibe
          </h3>
          <button
            onClick={() => setMusicPanelOpen(false)}
            className="text-white text-lg hover:text-red-400 transition"
          >
            ✖
          </button>
        </div>
        <div className="space-y-2">
          <button
            onClick={() => changeMusic("37i9dQZF1DZ06evO0FDzS8")}
            className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white flex items-center gap-2"
          >
            🎹 <span>Deep Focus</span>
          </button>
          <button
            onClick={() => changeMusic("37i9dQZF1DWZeKCadgRdKQ")}
            className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white flex items-center gap-2"
          >
            🎻 <span>Classical Study</span>
          </button>
          <button
            onClick={() => changeMusic("37i9dQZF1DX3Kdv0IChEm9")}
            className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white flex items-center gap-2"
          >
            🎧 <span>Lofi Beats</span>
          </button>
          <button
            onClick={() => changeMusic("37i9dQZF1DWXe9gFZP0gtP")}
            className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white flex items-center gap-2"
          >
            🌧️ <span>Ambient Rain</span>
          </button>
          <button
            onClick={() => changeMusic("37i9dQZF1DX1s9knjP51Oa")}
            className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white flex items-center gap-2"
          >
            🎸 <span>Acoustic Focus</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default FocusPlaylist;
