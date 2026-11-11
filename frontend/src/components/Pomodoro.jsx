import React, { useState, useEffect, useRef } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useTheme } from "../context/ThemeContext";

const POMODORO_STORAGE_KEY = "focusora:myspace:pomodoro";

const clampDuration = (value, fallback) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(60, Math.max(1, Math.floor(parsed)));
};

const parsePomodoroSnapshot = (rawValue, fallbackWorkDuration, fallbackBreakDuration) => {
  const fallbackState = {
    workDuration: fallbackWorkDuration,
    breakDuration: fallbackBreakDuration,
    onBreak: false,
    isRunning: false,
    sessionTotalSeconds: fallbackWorkDuration * 60,
    timeLeft: fallbackWorkDuration * 60,
  };

  if (!rawValue) return fallbackState;

  try {
    const parsed = JSON.parse(rawValue);
    const workDuration = clampDuration(parsed?.workDuration, fallbackWorkDuration);
    const breakDuration = clampDuration(parsed?.breakDuration, fallbackBreakDuration);
    const onBreak = Boolean(parsed?.onBreak);
    const isRunning = Boolean(parsed?.isRunning);
    const expectedSessionSeconds = (onBreak ? breakDuration : workDuration) * 60;
    const parsedSessionTotal = Math.floor(Number(parsed?.sessionTotalSeconds));
    const parsedTimeLeft = Math.floor(Number(parsed?.timeLeft));
    const sessionTotalSeconds = Number.isFinite(parsedSessionTotal) && parsedSessionTotal > 0
      ? parsedSessionTotal
      : expectedSessionSeconds;
    const boundedTimeLeft = Number.isFinite(parsedTimeLeft)
      ? Math.min(sessionTotalSeconds, Math.max(0, parsedTimeLeft))
      : sessionTotalSeconds;

    return {
      workDuration,
      breakDuration,
      onBreak,
      isRunning,
      sessionTotalSeconds,
      timeLeft: boundedTimeLeft,
    };
  } catch {
    return fallbackState;
  }
};

const Pomodoro = ({
  addNotification = () => { },
  onWorkSessionStart = () => {},
  onWorkSessionComplete = () => {},
  defaultWorkDuration = 25,
  defaultBreakDuration = 5,
}) => {
  const safeDefaultWorkDuration = clampDuration(defaultWorkDuration, 25);
  const safeDefaultBreakDuration = clampDuration(defaultBreakDuration, 5);

  const initialStateRef = useRef(
    parsePomodoroSnapshot(
      typeof window !== "undefined" ? localStorage.getItem(POMODORO_STORAGE_KEY) : null,
      safeDefaultWorkDuration,
      safeDefaultBreakDuration
    )
  );
  const initialState = initialStateRef.current;

  const [workDuration, setWorkDuration] = useState(initialState.workDuration);
  const [breakDuration, setBreakDuration] = useState(initialState.breakDuration);
  const [timeLeft, setTimeLeft] = useState(initialState.timeLeft);
  const [sessionTotalSeconds, setSessionTotalSeconds] = useState(initialState.sessionTotalSeconds);
  const [isRunning, setIsRunning] = useState(initialState.isRunning);
  const [onBreak, setOnBreak] = useState(initialState.onBreak);
  const soundOn = true;
  const { darkMode } = useTheme();
  const theme = darkMode ? "dark" : "light";
  const autoStartNext = true;

  const intervalRef = useRef(null);
  const hasAwardedCurrentWorkRef = useRef(false);
  const hasLoggedCurrentWorkStartRef = useRef(
    !initialState.onBreak && initialState.timeLeft < initialState.sessionTotalSeconds
  );
  const previousWorkDefaultRef = useRef(safeDefaultWorkDuration);
  const previousBreakDefaultRef = useRef(safeDefaultBreakDuration);
  const beepSound = useRef(
    new Audio("https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3")
  );

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            clearInterval(intervalRef.current);
            setIsRunning(false);

            if (soundOn) {
              beepSound.current.currentTime = 0;
              beepSound.current.play().catch((e) => console.log("Sound error:", e));
            }

            if ("Notification" in window && Notification.permission === "granted") {
              const message = onBreak
                ? "Work session complete! Time for a break."
                : "Break is over! Ready to work?";
              new Notification("Focusora - Pomodoro Timer", { body: message });
            }

            if (!onBreak) {
              addNotification("🎉 Work session complete!");
              if (!hasAwardedCurrentWorkRef.current) {
                hasAwardedCurrentWorkRef.current = true;
                Promise.resolve(
                  onWorkSessionComplete({ durationMinutes: workDuration })
                ).catch((error) => {
                  console.error("Failed to award pomodoro points", error);
                });
              }
            } else {
              addNotification("✅ Break complete!");
              hasAwardedCurrentWorkRef.current = false;
              hasLoggedCurrentWorkStartRef.current = false;
            }

            const nextOnBreak = !onBreak;
            const nextSessionSeconds = (nextOnBreak ? breakDuration : workDuration) * 60;

            setOnBreak(nextOnBreak);
            setTimeLeft(nextSessionSeconds);
            setSessionTotalSeconds(nextSessionSeconds);

            if (autoStartNext) {
              setTimeout(() => setIsRunning(true), 1000);
            }

            return 0;
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, onBreak, workDuration, breakDuration, addNotification, onWorkSessionComplete, soundOn, autoStartNext]);

  useEffect(() => {
    if (!isRunning || onBreak || hasLoggedCurrentWorkStartRef.current) return;

    hasLoggedCurrentWorkStartRef.current = true;
    Promise.resolve(onWorkSessionStart({ durationMinutes: workDuration })).catch((error) => {
      console.error("Failed to log pomodoro start activity", error);
    });
  }, [isRunning, onBreak, workDuration, onWorkSessionStart]);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (previousWorkDefaultRef.current === safeDefaultWorkDuration) {
      return;
    }

    previousWorkDefaultRef.current = safeDefaultWorkDuration;
    setWorkDuration(safeDefaultWorkDuration);

    if (!isRunning && !onBreak) {
      const nextSeconds = safeDefaultWorkDuration * 60;
      setTimeLeft(nextSeconds);
      setSessionTotalSeconds(nextSeconds);
    }
  }, [safeDefaultWorkDuration, isRunning, onBreak]);

  useEffect(() => {
    if (previousBreakDefaultRef.current === safeDefaultBreakDuration) {
      return;
    }

    previousBreakDefaultRef.current = safeDefaultBreakDuration;
    setBreakDuration(safeDefaultBreakDuration);

    if (!isRunning && onBreak) {
      const nextSeconds = safeDefaultBreakDuration * 60;
      setTimeLeft(nextSeconds);
      setSessionTotalSeconds(nextSeconds);
    }
  }, [safeDefaultBreakDuration, isRunning, onBreak]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const snapshot = {
      workDuration,
      breakDuration,
      timeLeft,
      sessionTotalSeconds,
      isRunning,
      onBreak,
    };

    localStorage.setItem(POMODORO_STORAGE_KEY, JSON.stringify(snapshot));
  }, [workDuration, breakDuration, timeLeft, sessionTotalSeconds, isRunning, onBreak]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    const nextSeconds = workDuration * 60;
    setIsRunning(false);
    setOnBreak(false);
    setTimeLeft(nextSeconds);
    setSessionTotalSeconds(nextSeconds);
    hasAwardedCurrentWorkRef.current = false;
    hasLoggedCurrentWorkStartRef.current = false;
  };

  const handleWorkDurationChange = (e) => {
    const minutes = parseInt(e.target.value, 10);
    if (!isNaN(minutes) && minutes >= 1 && minutes <= 60) {
      setWorkDuration(minutes);
      if (!isRunning && !onBreak) {
        const nextSeconds = minutes * 60;
        setTimeLeft(nextSeconds);
        setSessionTotalSeconds(nextSeconds);
      }
    }
  };


  const handleBreakDurationChange = (e) => {
    const minutes = parseInt(e.target.value, 10);
    if (!isNaN(minutes) && minutes >= 1 && minutes <= 60) {
      setBreakDuration(minutes);
      if (!isRunning && onBreak) {
        const nextSeconds = minutes * 60;
        setTimeLeft(nextSeconds);
        setSessionTotalSeconds(nextSeconds);
      }
    }
  };

  const safeSessionTotal = Math.max(1, sessionTotalSeconds);
  const elapsedSeconds = Math.max(0, safeSessionTotal - timeLeft);
  const progressValue = Math.min(100, (elapsedSeconds / safeSessionTotal) * 100);

  return (
    <div
      className="w-full max-w-[400px] group relative overflow-hidden rounded-2xl bg-white/95 dark:bg-white/10 backdrop-blur-lg border border-slate-200/50 dark:border-white/20 shadow-xl transition-all duration-300 min-h-[300px] flex flex-col text-slate-800 dark:text-white"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

      <div className="relative p-3 pb-2 flex-1 flex flex-col justify-center items-center space-y-3">
        <div className="mb-0">
          <h2 className="text-xl font-semibold text-slate-850 dark:text-white tracking-wide drop-shadow-sm">
            Pomodoro
          </h2>
        </div>

        <div className="w-32 h-32">
          <CircularProgressbar
            value={progressValue}
            text={formatTime(timeLeft)}
            styles={buildStyles({
              textColor: theme === "dark" ? "#fff" : "#000",
              pathColor: onBreak ? "#22c55e" : "#ef4444",
              trailColor: theme === "dark" ? "#334155" : "#d1d5db",
              backgroundColor: theme === "dark" ? "#111827" : "#f9fafb",
            })}
          />
        </div>

        <div className="flex flex-col items-center w-full mt-2">
          {/* Mobile layout: all 3 in single row */}
          <div className="flex sm:hidden items-center justify-center gap-2 w-full">
            <button
              onClick={handleStart}
              disabled={isRunning}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium 
                border border-green-400/50 bg-slate-100/50 dark:bg-white/5 backdrop-blur-md
                transition-all duration-300 select-none cursor-pointer
                ${isRunning ? "opacity-40 cursor-not-allowed" : "hover:bg-green-500/20 hover:border-green-400"}
              `}
            >
              <span className="text-green-500">▶</span>
              <span className="text-slate-800 dark:text-white">Start</span>
            </button>

            <button
              onClick={handlePause}
              className="
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                border border-amber-400/50 bg-slate-100/50 dark:bg-white/5 backdrop-blur-md
                transition-all duration-300 select-none cursor-pointer
                hover:bg-amber-500/20 hover:border-amber-400
              "
            >
              <span className="text-amber-500">⏸</span>
              <span className="text-slate-800 dark:text-white">Pause</span>
            </button>

            <button
              onClick={handleReset}
              className="
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                border border-red-400/50 bg-slate-100/50 dark:bg-white/5 backdrop-blur-md
                transition-all duration-300 select-none cursor-pointer
                hover:bg-red-500/20 hover:border-red-400
              "
            >
              <span className="text-red-500">🔄</span>
              <span className="text-slate-800 dark:text-white">Reset</span>
            </button>
          </div>

          {/* Laptop/Desktop layout: Start & Pause top, Reset bottom */}
          <div className="hidden sm:flex flex-col items-center w-full">
            <div className="flex space-x-3">
              <button
                onClick={handleStart}
                disabled={isRunning}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium 
                  border border-green-400/50 bg-slate-100/50 dark:bg-white/5 backdrop-blur-md
                  transition-all duration-300 select-none cursor-pointer
                  ${isRunning ? "opacity-40 cursor-not-allowed" : "hover:bg-green-500/20 hover:border-green-400"}
                `}
              >
                <span className="text-green-500">▶</span>
                <span className="text-slate-800 dark:text-white">Start</span>
              </button>

              <button
                onClick={handlePause}
                className="
                  flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium
                  border border-amber-400/50 bg-slate-100/50 dark:bg-white/5 backdrop-blur-md
                  transition-all duration-300 select-none cursor-pointer
                  hover:bg-amber-500/20 hover:border-amber-400
                "
              >
                <span className="text-amber-500">⏸</span>
                <span className="text-slate-800 dark:text-white">Pause</span>
              </button>
            </div>

            <div className="mt-2 flex justify-center w-full">
              <button
                onClick={handleReset}
                className="
                  flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium
                  border border-red-400/50 bg-slate-100/50 dark:bg-white/5 backdrop-blur-md
                  transition-all duration-300 select-none cursor-pointer
                  hover:bg-red-500/20 hover:border-red-400
                "
              >
                <span className="text-red-500">🔄</span>
                <span className="text-slate-800 dark:text-white">Reset</span>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-1">
          <span
            className={`inline-block px-3 py-1 rounded-full font-medium text-sm backdrop-blur-xl border 
       ${onBreak ? "border-green-400/40 text-green-300 bg-green-500/10"
                : "border-red-400/40 text-red-300 bg-red-500/10"}
    `}
          >
            {onBreak ? "Break Session" : "Work Session"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full max-w-xs mt-2">

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-200 tracking-wide">
              Work Duration
            </label>

            <input
              id="workInput"
              type="number"
              min="1"
              max="60"
              value={workDuration}
              onChange={handleWorkDurationChange}
              className="
        w-full px-3 py-2 rounded-lg
        bg-slate-100/50 dark:bg-white/10 border border-green-400/40
        text-slate-800 dark:text-white placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-green-400/50
        focus:bg-slate-200 dark:focus:bg-white/20 transition-all duration-200
      "
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-200 tracking-wide">
              Break Duration
            </label>

            <select
              id="breakSelect"
              value={breakDuration}
              onChange={handleBreakDurationChange}
              className="w-full px-3 py-2 rounded-lg bg-slate-100/50 dark:bg-white/10 border border-yellow-400/40 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:bg-slate-200 dark:focus:bg-white/20 transition-all duration-200 appearance-none"
            >
              <option value={5} className="bg-gray-900 text-white">Short (5 min)</option>
              <option value={15} className="bg-gray-900 text-white">Long (15 min)</option>
            </select>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Pomodoro;
