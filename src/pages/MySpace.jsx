import React, { useMemo, useState, useEffect } from "react";
import Pomodoro from "../components/Pomodoro";
import Notes from "../components/Notes";
import Todo from "../components/Todo";
import FocusPlaylist from "../components/FocusPlaylist";
import BackgroundSelector from "../components/BackgroundSelector";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { awardUserPoints } from "../utils/firestoreUtils";
import { POINT_RULES, getPomodoroPoints } from "../constants/pointsSystem";
import "./MySpace.css";

const DEFAULT_MYSPACE_BACKGROUND =
  "https://marketplace.canva.com/EAFekpb5NK0/1/0/1600w/canva-dark-modern-photo-mountain-and-sky-desktop-wallpaper-5ixgVU5XGxc.jpg";

const THEME_BACKGROUNDS = {
  forest:  "https://images.pexels.com/photos/158063/bellingrath-gardens-alabama-landscape-scenic-158063.jpeg",
  ocean:   "https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg",
  rain:    "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg",
  cafe:    "https://images.pexels.com/photos/3747579/pexels-photo-3747579.jpeg",
  library: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg",
};

const applyBodyBackground = (url) => {
  document.body.style.backgroundImage    = `url('${url}')`;
  document.body.style.backgroundSize     = "cover";
  document.body.style.backgroundRepeat   = "no-repeat";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundAttachment = "fixed";
};

const formatThemeName = (theme) => {
  const raw = String(theme || "forest").trim().toLowerCase();
  return raw ? `${raw.charAt(0).toUpperCase()}${raw.slice(1)}` : "Forest";
};

const getSavedBackgroundName = () => {
  if (typeof window === "undefined") return "";
  return (localStorage.getItem("myspace_background_name") || "").trim();
};

const MySpace = () => {
  const { darkMode } = useTheme();
  const { user, userProfile, reloadUser } = useAuth();
  const [bgPanelOpen, setBgPanelOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(64);
  const [notification, setNotification] = useState({
    show: false,
    icon: "✅",
    title: "Success",
    message: "Action completed",
  });

  const profileThemeLabel = useMemo(() => formatThemeName(userProfile?.theme), [userProfile?.theme]);
  const [liveThemeLabel, setLiveThemeLabel] = useState(
    () => getSavedBackgroundName() || profileThemeLabel
  );
  const safeWorkDuration  = Math.max(1, Math.floor(Number(userProfile?.pomodoroWork  ?? 25)));
  const safeBreakDuration = Math.max(1, Math.floor(Number(userProfile?.pomodoroBreak ?? 5)));
  const displayName       = userProfile?.displayName || user?.displayName || "Focusora learner";

  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      }).format(new Date()),
    []
  );

  /* ── background sync ── */
  useEffect(() => {
    const savedBg       = localStorage.getItem("myspace_background");
    const savedBgSource = localStorage.getItem("myspace_background_source");
    const themeLower    = String(userProfile?.theme || "forest").toLowerCase();
    const themeBackground      = THEME_BACKGROUNDS[themeLower] || DEFAULT_MYSPACE_BACKGROUND;
    const useManual            = Boolean(savedBg) && savedBgSource === "manual";
    const nextBackground       = useManual ? savedBg : themeBackground;

    applyBodyBackground(nextBackground);

    if (useManual) {
      setLiveThemeLabel(getSavedBackgroundName() || "Custom");
    } else {
      localStorage.setItem("myspace_background", nextBackground);
      localStorage.setItem("myspace_background_source", "profile-theme");
      localStorage.setItem("myspace_background_name", profileThemeLabel);
      setLiveThemeLabel(profileThemeLabel);
    }

    return () => { document.body.style.backgroundImage = ""; };
  }, [userProfile?.theme, profileThemeLabel]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const navElement = document.querySelector(".site-navbar") || document.querySelector("nav");
    if (!navElement) return undefined;

    const syncNavHeight = () => {
      const measured = Math.ceil(
        navElement.getBoundingClientRect().height || navElement.offsetHeight || 64
      );

      setNavHeight((previous) => (previous === measured ? previous : measured));
    };

    syncNavHeight();

    let navResizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      navResizeObserver = new ResizeObserver(syncNavHeight);
      navResizeObserver.observe(navElement);
    }

    window.addEventListener("resize", syncNavHeight);

    return () => {
      window.removeEventListener("resize", syncNavHeight);
      if (navResizeObserver) {
        navResizeObserver.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const syncThemeLabel = (event) => {
      const eventTheme = event?.detail?.name;
      if (eventTheme && String(eventTheme).trim()) {
        setLiveThemeLabel(String(eventTheme).trim());
        return;
      }

      const savedThemeName = getSavedBackgroundName();
      if (savedThemeName) {
        setLiveThemeLabel(savedThemeName);
        return;
      }

      setLiveThemeLabel(profileThemeLabel);
    };

    window.addEventListener("myspace-background-changed", syncThemeLabel);
    window.addEventListener("storage", syncThemeLabel);

    return () => {
      window.removeEventListener("myspace-background-changed", syncThemeLabel);
      window.removeEventListener("storage", syncThemeLabel);
    };
  }, [profileThemeLabel]);

  /* ── hide site footer on this page ── */
  useEffect(() => {
    const sel = document.querySelector("footer, .footer, #footer, .site-footer");
    if (!sel) return;
    const prev = sel.style.display;
    sel.style.display = "none";
    return () => { sel.style.display = prev || ""; };
  }, []);

  /* ── notification helpers ── */
  const addNotification = (message, title = "Success", icon = "✅") => {
    setNotification({ show: true, icon, title, message });
    setTimeout(() => setNotification((p) => ({ ...p, show: false })), 3000);
  };

  const hideNotification = () => setNotification((p) => ({ ...p, show: false }));

  /* ── point awarding ── */
  const awardPoints = async ({ points = 0, studyMinutes = 0, sessionsCount = 0, subject = "", roomId = null, message = "" }) => {
    if (!user) return;
    if (points <= 0 && studyMinutes <= 0 && sessionsCount <= 0) return;
    try {
      await awardUserPoints(user.uid, { points, studyMinutes, sessionsCount, subject, roomId });
      await reloadUser();
      if (message) addNotification(message, "Points", "⭐");
    } catch (err) {
      console.error("Failed to award points", err);
    }
  };

  const handlePomodoroComplete = async ({ durationMinutes }) => {
    const safeDuration   = Math.max(0, Math.floor(Number(durationMinutes || 0)));
    const awardedPoints  = getPomodoroPoints(safeDuration);
    await awardPoints({
      points:        awardedPoints,
      studyMinutes:  safeDuration,
      sessionsCount: safeDuration > 0 ? 1 : 0,
      subject:       "Pomodoro",
      message:       awardedPoints > 0 ? `+${awardedPoints} points from Pomodoro` : "",
    });
  };

  const handleNotesSaved = async () => {
    await awardPoints({
      points:  POINT_RULES.notesSave,
      message: `+${POINT_RULES.notesSave} point${POINT_RULES.notesSave === 1 ? "" : "s"} from Notes`,
    });
  };

  const handleTaskAdded = async () => {
    await awardPoints({
      points:  POINT_RULES.taskAdded,
      message: `+${POINT_RULES.taskAdded} point${POINT_RULES.taskAdded === 1 ? "" : "s"} for new task`,
    });
  };

  const handleTaskCompleted = async () => {
    await awardPoints({
      points:  POINT_RULES.taskCompleted,
      message: `+${POINT_RULES.taskCompleted} points for completed task`,
    });
  };

  /* ── derived class helpers ── */
  const toastClass  = `ms-toast ${notification.show ? "ms-toast--visible" : ""} ${darkMode ? "ms-toast--dark" : "ms-toast--light"}`;
  const titleClass  = `ms-toast__title ${darkMode ? "ms-toast__title--dark" : "ms-toast__title--light"}`;
  const msgClass    = `ms-toast__message ${darkMode ? "ms-toast__message--dark" : "ms-toast__message--light"}`;
  const closeClass  = `ms-toast__close ${darkMode ? "ms-toast__close--dark" : "ms-toast__close--light"}`;

  return (
    <div className="ms-page" style={{ "--ms-nav-height": `${navHeight}px` }}>
      {/* ── atmosphere layers ── */}
      <div className="ms-bg-overlay"  aria-hidden="true" />
      <div className="ms-bg-grid"     aria-hidden="true" />
      <div className="ms-aura ms-aura--blue"   aria-hidden="true" />
      <div className="ms-aura ms-aura--violet" aria-hidden="true" />

      {/* ── main content ── */}
      <main className="ms-content">

        {/* ── top bar ── */}
        <header className="ms-topbar ms-reveal" role="banner">
          <div className="ms-topbar__left">
            <div className="ms-topbar__identity">
              <h1 className="ms-topbar__title">My Space</h1>
              <p className="ms-topbar__subtitle">
                Welcome back, <strong>{displayName}</strong>. Your sessions, notes, and tasks — in one place.
              </p>
            </div>
            <nav className="ms-stat-strip" aria-label="Workspace context">
              <div className="ms-stat-chip">
                <span className="ms-stat-chip__label">Date</span>
                <span className="ms-stat-chip__divider" />
                <span className="ms-stat-chip__value">{todayLabel}</span>
              </div>
              <div className="ms-stat-chip">
                <span className="ms-stat-chip__label">Theme</span>
                <span className="ms-stat-chip__divider" />
                <span className="ms-stat-chip__value">{liveThemeLabel}</span>
              </div>
              <div className="ms-stat-chip">
                <span className="ms-stat-chip__label">Focus</span>
                <span className="ms-stat-chip__divider" />
                <span className="ms-stat-chip__value">{safeWorkDuration}/{safeBreakDuration} min</span>
              </div>
            </nav>
          </div>
        </header>

        {/* ── workspace panels ── */}
        <div className="ms-workspace ms-reveal ms-reveal--d1">

          {/* Focus Timer */}
          <section className="ms-workspace__timer ms-panel ms-panel--accented" aria-label="Focus Timer">
            <div className="ms-panel__header">
              <h2 className="ms-panel__title">Focus Timer</h2>
              <span className="ms-panel__badge">Deep Work</span>
            </div>
            <div className="ms-panel__body">
              <Pomodoro
                addNotification={addNotification}
                onWorkSessionComplete={handlePomodoroComplete}
                defaultWorkDuration={safeWorkDuration}
                defaultBreakDuration={safeBreakDuration}
              />
            </div>
          </section>

          {/* Workspace Notes */}
          <section className="ms-workspace__notes ms-panel ms-panel--accented ms-panel--accented-violet" aria-label="Workspace Notes">
            <div className="ms-panel__header">
              <h2 className="ms-panel__title">Notes</h2>
              <span className="ms-panel__badge ms-panel__badge--violet">Draft &amp; Save</span>
            </div>
            <div className="ms-panel__body">
              <Notes addNotification={addNotification} onNotesSaved={handleNotesSaved} />
            </div>
          </section>

          {/* Task Board */}
          <section className="ms-workspace__tasks ms-panel ms-panel--accented ms-panel--accented-neutral" aria-label="Task Board">
            <div className="ms-panel__header">
              <h2 className="ms-panel__title">Tasks</h2>
              <span className="ms-panel__badge ms-panel__badge--neutral">Plan &amp; Execute</span>
            </div>
            <div className="ms-panel__body">
              <Todo
                addNotification={addNotification}
                onTaskAdded={handleTaskAdded}
                onTaskCompleted={handleTaskCompleted}
              />
            </div>
          </section>
        </div>

        {/* ── sound & ambience ── */}
        <section className="ms-sound-section ms-reveal ms-reveal--d2" aria-label="Sound and Ambience">
          <div className="ms-sound-panel">
            <div className="ms-sound-panel__header">
              <div>
                <h2 className="ms-sound-panel__title">Sound &amp; Ambience</h2>
                <p className="ms-sound-panel__desc">
                  Pick a playlist, sync playback in shared rooms, or switch ambient sounds without leaving your flow.
                </p>
              </div>
            </div>
            <div className="ms-sound-panel__body">
              <FocusPlaylist
                addNotification={addNotification}
                bgPanelOpen={bgPanelOpen}
                setBgPanelOpen={setBgPanelOpen}
              />
            </div>
          </div>
        </section>

      </main>

      {/* ── background selector (portal/overlay) ── */}
      <BackgroundSelector
        bgPanelOpen={bgPanelOpen}
        setBgPanelOpen={setBgPanelOpen}
        addNotification={addNotification}
      />

      {/* ── toast notification ── */}
      <div
        className={toastClass}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="ms-toast__inner">
          <span className="ms-toast__icon" aria-hidden="true">{notification.icon}</span>
          <div className="ms-toast__text">
            <div className={titleClass}>{notification.title}</div>
            <div className={msgClass}>{notification.message}</div>
          </div>
          <button
            type="button"
            onClick={hideNotification}
            className={closeClass}
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default MySpace;
