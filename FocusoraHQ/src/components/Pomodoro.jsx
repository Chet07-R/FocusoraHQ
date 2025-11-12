import React, { useState, useEffect, useRef } from "react";

const Pomodoro = ({ addNotification = () => {} }) => {
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  
  const intervalRef = useRef(null);
  const beepSound = useRef(new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3'));

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            // Timer complete
            clearInterval(intervalRef.current);
            setIsRunning(false);
            
            // Play beep sound
            beepSound.current.currentTime = 0;
            beepSound.current.play().catch(e => console.log('Sound error:', e));
            
            // Show notification
            if ("Notification" in window && Notification.permission === "granted") {
              const message = onBreak ? 'Work session complete! Time for a break.' : 'Break is over! Ready to work?';
              new Notification('Focusora - Pomodoro Timer', { body: message });
            }
            
            if (!onBreak) {
              setSessionsCompleted(s => s + 1);
              addNotification("🎉 Work session complete!");
            } else {
              addNotification("✅ Break complete!");
            }
            
            // Switch session
            setOnBreak(!onBreak);
            setTimeLeft(onBreak ? workDuration * 60 : breakDuration * 60);
            
            // Auto-start next session after 1 second
            setTimeout(() => setIsRunning(true), 1000);
            
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
  }, [isRunning, onBreak, workDuration, breakDuration, addNotification]);

  useEffect(() => {
    // Request notification permission
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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
    setWorkDuration(minutes);
    if (!isRunning && !onBreak) {
      setTimeLeft(minutes * 60);
    }
  };

  const handleBreakDurationChange = (e) => {
    const minutes = parseInt(e.target.value, 10);
    setBreakDuration(minutes);
    if (!isRunning && onBreak) {
      setTimeLeft(minutes * 60);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-lg border border-white/20 shadow-xl transition-all duration-300 h-full min-h-[600px] flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative p-6 flex-1 flex flex-col justify-center">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-3">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Pomodoro
            </h2>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-6"></div>

        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-xl rounded-full"></div>
            <div className="relative text-6xl font-mono font-bold text-white drop-shadow-lg">
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleStart}
              disabled={isRunning}
              className={`px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Start
            </button>
            <button
              onClick={handlePause}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
            >
              Pause
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
            >
              Reset
            </button>
          </div>

          <div className="text-center space-y-3">
            <span className={`inline-block px-4 py-2 backdrop-blur-sm text-white font-medium rounded-full border border-white/30 ${onBreak ? 'bg-green-600' : 'bg-white/20'}`}>
              {onBreak ? 'Break Session' : 'Work Session'}
            </span>
            <div className="text-white/90">
              Sessions Completed: <span className="font-bold text-cyan-400">{sessionsCompleted}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">Work Duration</label>
              <div className="relative">
                <input
                  id="workInput"
                  type="number"
                  min="1"
                  max="60"
                  value={workDuration}
                  onChange={handleWorkDurationChange}
                  className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
                />
                <span className="absolute right-3 top-2 text-white/60 text-sm">min</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">Break Type</label>
              <select
                id="breakSelect"
                value={breakDuration}
                onChange={handleBreakDurationChange}
                className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
              >
                <option value="5" className="bg-gray-800">Short (5 min)</option>
                <option value="15" className="bg-gray-800">Long (15 min)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
