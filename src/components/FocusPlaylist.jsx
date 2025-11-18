// FocusPlaylist.jsx
import React, { useEffect, useRef, useState } from "react";
import { useStudyRoom } from "../context/StudyRoomContext";
import { useAuth } from "../context/AuthContext";

const FocusPlaylist = ({ addNotification, bgPanelOpen, setBgPanelOpen }) => {
  const [musicPanelOpen, setMusicPanelOpen] = useState(false);
  const { currentRoom, roomData, updatePlaylist, signalPlayback } = useStudyRoom();
  const { user, userProfile } = useAuth();
  const [spotifyUrl, setSpotifyUrl] = useState(
    localStorage.getItem("spotify_playlist") ||
      "https://open.spotify.com/embed/playlist/37i9dQZF1DZ06evO0FDzS8?utm_source=generator"
  );
  const lastPlayerAtRef = useRef(0);
  const [syncPrompt, setSyncPrompt] = useState(null);

  // sync from room
  useEffect(() => {
    if (currentRoom && roomData?.spotifyUrl) {
      setSpotifyUrl(roomData.spotifyUrl);
      localStorage.setItem("spotify_playlist", roomData.spotifyUrl);
      if (roomData?.playlistUpdatedByName && (!user || roomData.playlistUpdatedById !== user.uid)) {
        addNotification(`🎵 Playlist changed by ${roomData.playlistUpdatedByName}`);
      }
    }
  }, [currentRoom, roomData?.spotifyUrl]);

  // Listen for shared playback signals (play/pause) and prompt user action
  useEffect(() => {
    if (!currentRoom) return;
    const at = roomData?.playerAt?.toMillis?.() || 0;
    const action = roomData?.playerAction;
    const actorId = roomData?.playerUpdatedById;
    const actorName = roomData?.playerUpdatedByName || "Someone";
    if (!action || !at) return;
    if (lastPlayerAtRef.current === at) return;
    lastPlayerAtRef.current = at;
    if (user && actorId === user.uid) return; // ignore self signals

    // Show a prompt asking user to click play/pause due to autoplay restrictions
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
      } catch (e) {
        addNotification("❌ Failed to update playlist");
      }
    } else {
      setSpotifyUrl(newUrl);
      localStorage.setItem("spotify_playlist", newUrl);
      addNotification("🎵 Music Changed");
    }
    setMusicPanelOpen(false);
  };

  const changeMusicUrl = async (newUrl) => {
    if (currentRoom) {
      try {
        await updatePlaylist(newUrl);
        addNotification("🎵 Playlist updated for everyone");
      } catch (e) {
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
      {/* ===== FOCUS PLAYLIST SECTION ===== */}
      <div className="w-full mb-8">
        <div className="bg-gradient-to-r from-black/60 via-gray-900/80 to-black/60 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg text-white">
          <div className="px-2 sm:px-4 md:px-6 py-4">
            <div className="flex flex-wrap items-center justify-between mb-3 gap-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎵</span>
                <span className="font-semibold">Focus Playlist</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setMusicPanelOpen(!musicPanelOpen);
                    if (setBgPanelOpen) setBgPanelOpen(false);
                  }}
                  className="text-sm bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition"
                >
                  🎧 Change Music
                </button>
                {currentRoom && (
                  <>
                    <button
                      onClick={() => signalPlayback('play')}
                      className="text-sm bg-emerald-500/80 hover:bg-emerald-500 px-3 py-2 rounded-lg transition"
                    >
                      ▶ Play for everyone
                    </button>
                    <button
                      onClick={() => signalPlayback('pause')}
                      className="text-sm bg-orange-500/80 hover:bg-orange-500 px-3 py-2 rounded-lg transition"
                    >
                      ⏸ Pause for everyone
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    if (setBgPanelOpen) setBgPanelOpen(!bgPanelOpen);
                    setMusicPanelOpen(false);
                  }}
                  className="text-sm bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition"
                >
                  🌈 Choose Ambience
                </button>
                <span className="text-sm text-white/70">Powered by Spotify</span>
              </div>
            </div>
            {syncPrompt && (
              <div className="mb-3 px-3 py-2 rounded-lg bg-white/10 text-white flex flex-col sm:flex-row items-center justify-between gap-2">
                <span>
                  {syncPrompt.type === 'play'
                    ? `${syncPrompt.by} pressed Play — click the ▶ button in the player to start.`
                    : `${syncPrompt.by} pressed Pause — pause your player to sync.`}
                </span>
                <button
                  onClick={() => setSyncPrompt(null)}
                  className="text-xs bg-white/20 hover:bg-white/30 rounded px-2 py-1"
                >
                  Dismiss
                </button>
              </div>
            )}
            <iframe
              id="spotifyPlayer"
              style={{ borderRadius: "12px" }}
              src={spotifyUrl}
              width="100%"
              // Responsive height below
              className="h-20 sm:h-24 md:h-32"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              title="Focus Playlist"
            ></iframe>
          </div>
        </div>
      </div>

      {/* ===== MUSIC SELECTOR PANEL ===== */}
      <div
        className={`fixed bottom-0 left-0 w-full max-w-full rounded-t-2xl md:rounded-2xl md:left-1/2 md:bottom-36 md:transform md:-translate-x-1/2 md:w-96 max-w-[90vw]
          bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-xl border border-white/20 shadow-xl p-4 md:p-5 transition-all duration-500 z-50 ${
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
        {/* Responsive grid for playlist buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* <button
            onClick={() =>
              changeMusicUrl(
                "https://open.spotify.com/embed/artist/6DARBhWbfcS9E4yJzcliqQ?utm_source=generator"
              )
            }
            className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white flex items-center gap-2"
          >
            🎤 <span>Karan Aujla</span>
          </button> */}
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
