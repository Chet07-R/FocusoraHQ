import React, { useState, useEffect, useRef } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Pomodoro = ({ addNotification = () => { } }) => {
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [goal, setGoal] = useState(4);
  const [theme, setTheme] = useState("dark");
  const [autoStartNext, setAutoStartNext] = useState(true);

  const intervalRef = useRef(null);
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

            // Play beep sound if enabled
            if (soundOn) {
              beepSound.current.currentTime = 0;
              beepSound.current.play().catch((e) => console.log("Sound error:", e));
            }

            // Show notification
            if ("Notification" in window && Notification.permission === "granted") {
              const message = onBreak
                ? "Work session complete! Time for a break."
                : "Break is over! Ready to work?";
              new Notification("Focusora - Pomodoro Timer", { body: message });
            }

            if (!onBreak) {
              setSessionsCompleted((s) => s + 1);
              addNotification("🎉 Work session complete!");
            } else {
              addNotification("✅ Break complete!");
            }

            // Switch session
            setOnBreak(!onBreak);
            setTimeLeft(onBreak ? workDuration * 60 : breakDuration * 60);

            if (autoStartNext) {
              // Auto-start next session after 1 second
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
  }, [isRunning, onBreak, workDuration, breakDuration, addNotification, soundOn, autoStartNext]);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

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
    setIsRunning(false);
    setOnBreak(false);
    setTimeLeft(workDuration * 60);
    setSessionsCompleted(0);
  };

  const handleWorkDurationChange = (e) => {
    const minutes = parseInt(e.target.value, 10);
    if (!isNaN(minutes) && minutes >= 0 && minutes <= 60) {
      setWorkDuration(minutes);
      if (!isRunning && !onBreak) {
        setTimeLeft(minutes * 60);
      }
    }
  };


  const handleBreakDurationChange = (e) => {
    const minutes = parseInt(e.target.value, 10);
    if (!isNaN(minutes) && minutes >= 1 && minutes <= 60) {
      setBreakDuration(minutes);
      if (!isRunning && onBreak) {
        setTimeLeft(minutes * 60);
      }
    }
  };

  const handleGoalChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 12) {
      setGoal(value);
    }
  };

  const toggleSound = () => {
    setSoundOn((prev) => !prev);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleAutoStart = () => {
    setAutoStartNext((prev) => !prev);
  };

  const sessionTotal = onBreak ? breakDuration * 60 : workDuration * 60;
  const progressValue = ((sessionTotal - timeLeft) / sessionTotal) * 100;

  return (
    <div
      className="w-full max-w-[450px] group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-lg border border-white/20 shadow-xl transition-all duration-300 h-full min-h-[600px] flex flex-col"

    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

      <div className="relative p-6 pb-2 flex-1 flex flex-col justify-center items-center space-y-8">
        <div className="mb-0">
          <h2 className="text-3xl font-semibold text-white tracking-wide drop-shadow-lg">
            Pomodoro
          </h2>
        </div>


        <div className="w-48 h-48">
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

        {/* Button Section */}
        <div className="flex flex-col items-center w-full mt-4">

          {/* Start + Pause in one row */}
          <div className="flex space-x-6">

            {/* Start */}
            <button
              onClick={handleStart}
              disabled={isRunning}
              className={`
        flex items-center gap-2 px-6 py-2 rounded-xl font-medium 
        border border-green-400/50 bg-white/5 backdrop-blur-md
        transition-all duration-300 select-none
        ${isRunning ? "opacity-40 cursor-not-allowed" : "hover:bg-green-500/20 hover:border-green-400"}
      `}
            >
              <span className="text-green-400">▶</span>
              <span className="text-white">Start</span>
            </button>

            {/* Pause */}
            <button
              onClick={handlePause}
              className="
        flex items-center gap-2 px-6 py-2 rounded-xl font-medium
        border border-amber-400/50 bg-white/5 backdrop-blur-md
        transition-all duration-300 select-none
        hover:bg-amber-500/20 hover:border-amber-400
      "
            >
              <span className="text-amber-400">⏸</span>
              <span className="text-white">Pause</span>
            </button>
          </div>

          {/* Reset button centered below */}
          <div className="mt-4 flex justify-center w-full">
            <button
              onClick={handleReset}
              className="
        flex items-center gap-2 px-6 py-2 rounded-xl font-medium
        border border-red-400/50 bg-white/5 backdrop-blur-md
        transition-all duration-300 select-none
        hover:bg-red-500/20 hover:border-red-400
      "
            >
              <span className="text-red-400">🔄</span>
              <span className="text-white">Reset</span>
            </button>
          </div>

        </div>

        <div className="text-center mt-2">
          <span
            className={`inline-block px-5 py-2 rounded-full font-medium text-sm backdrop-blur-xl border 
       ${onBreak ? "border-green-400/40 text-green-300 bg-green-500/10"
                : "border-red-400/40 text-red-300 bg-red-500/10"}
    `}
          >
            {onBreak ? "Break Session" : "Work Session"}
          </span>
        </div>


        <div className="grid grid-cols-2 gap-6 w-full max-w-xs mt-4">

          {/* Work Duration */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200 tracking-wide">
              Work Duration
            </label>

            <input
              id="workInput"
              type="number"
              min="0"
              max="60"
              value={workDuration}
              onChange={handleWorkDurationChange}
              className="
        w-full px-3 py-2 rounded-lg
        bg-white/10 border border-green-400/40
        text-white placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-green-400/50
        focus:bg-white/20 transition-all duration-200
      "
            />
          </div>

          {/* Break Duration */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200 tracking-wide">
              Break Duration
            </label>

            <select
              id="breakSelect"
              value={breakDuration}
              onChange={handleBreakDurationChange}
              className="
    w-full px-3 py-2 rounded-lg
    bg-white/10 border border-yellow-400/40
    text-white
    focus:outline-none focus:ring-2 focus:ring-yellow-400/50
    focus:bg-white/20 transition-all duration-200
    appearance-none
  "
            >
              <option className="bg-gray-900 text-white">Short (5 min)</option>
              <option className="bg-gray-900 text-white">Long (15 min)</option>
              <option className="bg-gray-900 text-white">Custom (20 min)</option>
            </select>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Pomodoro;
