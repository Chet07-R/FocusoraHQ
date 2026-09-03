import React, { useEffect, useRef, useState } from "react";
import { useStudyRoom } from "../context/StudyRoomContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const FocusPlaylist = ({ addNotification, bgPanelOpen, setBgPanelOpen }) => {
  const [musicPanelOpen, setMusicPanelOpen] = useState(false);
  const { currentRoom, roomData, updatePlaylist, signalPlayback } = useStudyRoom();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [spotifyUrl, setSpotifyUrl] = useState(
    localStorage.getItem("spotify_playlist") ||
      "https://open.spotify.com/embed/playlist/37i9dQZF1DZ06evO0FDzS8?utm_source=generator"
  );
  const lastPlayerAtRef = useRef(0);
  const [syncPrompt, setSyncPrompt] = useState(null);

  useEffect(() => {
    if (currentRoom && roomData?.spotifyUrl) {
      setSpotifyUrl(roomData.spotifyUrl);
      localStorage.setItem("spotify_playlist", roomData.spotifyUrl);
      if (roomData?.playlistUpdatedByName && (!user || roomData.playlistUpdatedById !== user.uid)) {
        addNotification(`Playlist changed by ${roomData.playlistUpdatedByName}`);
      }
    }
  }, [currentRoom, roomData?.spotifyUrl]);

  useEffect(() => {
    if (musicPanelOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [musicPanelOpen]);

  useEffect(() => {
    if (!currentRoom) return;
    const at = roomData?.playerAt?.toMillis?.() || 0;
    const action = roomData?.playerAction;
    const actorId = roomData?.playerUpdatedById;
    const actorName = roomData?.playerUpdatedByName || "Someone";
    if (!action || !at) return;
    if (lastPlayerAtRef.current === at) return;
    lastPlayerAtRef.current = at;
    if (user && actorId === user.uid) return;
    if (action === 'play') {
      setSyncPrompt({ type: 'play', by: actorName });
      addNotification(`▶ ${actorName} pressed Play — click the player to start`);
    } else if (action === 'pause') {
      setSyncPrompt({ type: 'pause', by: actorName });
      addNotification(`⏸ ${actorName} pressed Pause — pause your player to sync`);
    }
  }, [currentRoom, roomData?.playerAt]);

  const changeMusic = async (playlistId) => {
    const newUrl = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`;
    if (currentRoom) {
      try {
        await updatePlaylist(newUrl);
        addNotification("🎵 Playlist updated for everyone");
      } catch {
        addNotification("❌ Failed to update playlist");
      }
    } else {
      setSpotifyUrl(newUrl);
      localStorage.setItem("spotify_playlist", newUrl);
      addNotification("🎵 Music Changed");
    }
    setMusicPanelOpen(false);
  };

  return (
    <>
      <div className="w-full">
        <div className={`bg-gradient-to-r ${darkMode ? 'from-black/60 via-gray-900/80 to-black/60 text-white border-white/10' : 'from-slate-100/80 via-slate-50/90 to-slate-100/80 text-slate-800 border-slate-200/50'} backdrop-blur-xl border rounded-xl shadow-sm`}>
          <div className="px-2.5 sm:px-3.5 py-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-1.5 gap-1.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs sm:text-sm">Focus Playlist</span>
              </div>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setMusicPanelOpen(!musicPanelOpen);
                    if (setBgPanelOpen) setBgPanelOpen(false);
                  }}
                  className="text-xs bg-slate-200/50 dark:bg-white/10 hover:bg-slate-300/50 dark:hover:bg-white/20 text-slate-800 dark:text-white px-2 py-1 rounded-lg transition cursor-pointer"
                >
                  Change Music
                </button>
                {currentRoom && (
                  <>
                    <button
                      type="button"
                      onClick={() => signalPlayback('play')}
                      className="text-xs bg-emerald-500/80 hover:bg-emerald-500 text-white px-2 py-1 rounded-lg transition cursor-pointer"
                    >
                      Play
                    </button>
                    <button
                      type="button"
                      onClick={() => signalPlayback('pause')}
                      className="text-xs bg-orange-500/80 hover:bg-orange-500 text-white px-2 py-1 rounded-lg transition cursor-pointer"
                    >
                      Pause
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (setBgPanelOpen) setBgPanelOpen(!bgPanelOpen);
                    setMusicPanelOpen(false);
                  }}
                  className="text-xs bg-slate-200/50 dark:bg-white/10 hover:bg-slate-300/50 dark:hover:bg-white/20 text-slate-800 dark:text-white px-2 py-1 rounded-lg transition cursor-pointer"
                >
                  Ambience
                </button>
                <span className="text-[11px] text-slate-500 dark:text-white/70 ml-auto sm:ml-0">Spotify</span>
              </div>
            </div>
            {syncPrompt && (
              <div className="mb-1.5 px-2.5 py-1 rounded-lg bg-white/10 text-white flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                <span>
                  {syncPrompt.type === 'play'
                    ? `${syncPrompt.by} pressed Play — click the player to start.`
                    : `${syncPrompt.by} pressed Pause — pause your player to sync.`}
                </span>
                <button
                  type="button"
                  onClick={() => setSyncPrompt(null)}
                  className="text-[10px] bg-white/20 hover:bg-white/30 rounded px-1.5 py-0.5 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}
            <iframe
              id="spotifyPlayer"
              style={{ borderRadius: "8px" }}
              src={spotifyUrl}
              width="100%"
              className="h-[80px]"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              title="Focus Playlist"
            ></iframe>
          </div>
        </div>
      </div>

      <div
        className={`fixed bottom-3 left-3 right-3 sm:left-4 sm:right-4 md:left-1/2 md:right-auto md:bottom-36 md:transform md:-translate-x-1/2 md:w-96 max-h-[80vh] overflow-y-auto rounded-2xl
          bg-white/95 dark:bg-gray-900/95 text-slate-800 dark:text-white backdrop-blur-2xl border border-slate-200/80 dark:border-white/20 shadow-2xl p-4 md:p-5 transition-all duration-300 z-[11070] ${
          musicPanelOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-6 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-base sm:text-lg text-slate-800 dark:text-white">
            Choose Your Vibe
          </h3>
          <button
            type="button"
            onClick={() => setMusicPanelOpen(false)}
            className="text-slate-500 hover:text-slate-800 dark:text-gray-300 dark:hover:text-red-400 text-lg transition cursor-pointer p-1"
          >
            ✕
          </button>
        </div>
    
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => changeMusic("37i9dQZF1DZ06evO0FDzS8")}
            className="w-full text-left px-4 py-2.5 sm:py-3 bg-slate-100 hover:bg-slate-200/80 dark:bg-white/10 dark:hover:bg-white/20 rounded-xl text-slate-800 dark:text-white font-medium text-sm transition flex items-center justify-between cursor-pointer border border-slate-200/60 dark:border-white/5"
          >
            <span>Deep Focus</span>
          </button>
          <button
            type="button"
            onClick={() => changeMusic("37i9dQZF1DWZeKCadgRdKQ")}
            className="w-full text-left px-4 py-2.5 sm:py-3 bg-slate-100 hover:bg-slate-200/80 dark:bg-white/10 dark:hover:bg-white/20 rounded-xl text-slate-800 dark:text-white font-medium text-sm transition flex items-center justify-between cursor-pointer border border-slate-200/60 dark:border-white/5"
          >
            <span>Classical Study</span>
          </button>
          <button
            type="button"
            onClick={() => changeMusic("37i9dQZF1DX3Kdv0IChEm9")}
            className="w-full text-left px-4 py-2.5 sm:py-3 bg-slate-100 hover:bg-slate-200/80 dark:bg-white/10 dark:hover:bg-white/20 rounded-xl text-slate-800 dark:text-white font-medium text-sm transition flex items-center justify-between cursor-pointer border border-slate-200/60 dark:border-white/5"
          >
            <span>Lofi Beats</span>
          </button>
          <button
            type="button"
            onClick={() => changeMusic("37i9dQZF1DWXe9gFZP0gtP")}
            className="w-full text-left px-4 py-2.5 sm:py-3 bg-slate-100 hover:bg-slate-200/80 dark:bg-white/10 dark:hover:bg-white/20 rounded-xl text-slate-800 dark:text-white font-medium text-sm transition flex items-center justify-between cursor-pointer border border-slate-200/60 dark:border-white/5"
          >
            <span>Ambient Rain</span>
          </button>
          <button
            type="button"
            onClick={() => changeMusic("37i9dQZF1DX1s9knjP51Oa")}
            className="w-full text-left px-4 py-2.5 sm:py-3 bg-slate-100 hover:bg-slate-200/80 dark:bg-white/10 dark:hover:bg-white/20 rounded-xl text-slate-800 dark:text-white font-medium text-sm transition flex items-center justify-between cursor-pointer border border-slate-200/60 dark:border-white/5"
          >
            <span>Acoustic Focus</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default FocusPlaylist;