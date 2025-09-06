// To do list

function addtask() {
    const taskInput = document.getElementById('input-task');
    const taskText = taskInput.value.trim(); // remove spaces

    if (taskText === "") {
        return; // stop if empty
    }

    const newTask = document.createElement('li');
    const taskList = document.getElementById('task-list');

    newTask.textContent = taskText;
    newTask.className = 'flex items-center justify-between bg-blue-100 p-2 my-2 rounded-lg shadow-sm w-80 dark:text-black';

    taskList.appendChild(newTask);
    deletetask(newTask);

    taskInput.value = ""; // clear input after adding
}


function deletetask(newtask){
    const deletebtn = document.createElement('button')
    deletebtn.textContent = 'Delete'

    deletebtn.className = 'ml-4 p-1 px-1 text-sm bg-red-400 text-white rounded-xl hover:bg-red-600';

    newtask.appendChild(deletebtn)

    deletebtn.onclick = function(){
        newtask.remove()
    }
}

// Pomodoro Timer Script
document.addEventListener('DOMContentLoaded', () => {
    // Pomodoro settings in seconds (default)
    let workDuration = 25 * 60;
    let breakDuration = 5 * 60;
    let timeLeft = workDuration;
    let timerInterval;
    let isRunning = false;
    let onBreak = false;
    let sessionsCompleted = 0;

    const timerEl = document.getElementById('timer');
    const sessionTypeEl = document.getElementById('sessionType');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const workInput = document.getElementById('workInput');
    const breakSelect = document.getElementById('breakSelect');
    const sessionCounterEl = document.getElementById('sessionCounter');
    
    // Update durations when inputs change
    workInput.addEventListener('change', () => {
      const minutes = parseInt(workInput.value, 10);
      workDuration = minutes * 60;
      if (!isRunning && !onBreak) {
        timeLeft = workDuration;
        updateTimer();
      }
    });
    
    breakSelect.addEventListener('change', () => {
      const minutes = parseInt(breakSelect.value, 10);
      breakDuration = minutes * 60;
      if (!isRunning && onBreak) {
        timeLeft = breakDuration;
        updateTimer();
      }
    });

    function updateTimer() {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerEl.textContent = `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
      updateDocumentTitle();
    }

    function switchSession() {
      onBreak = !onBreak;
      timeLeft = onBreak ? breakDuration : workDuration;
      sessionTypeEl.textContent = onBreak ? 'Break Session' : 'Work Session';
      
      // Change session label styling based on session type
      if (onBreak) {
        sessionTypeEl.classList.add('bg-green-100');
        sessionTypeEl.classList.remove('bg-blue-100');
      } else {
        sessionTypeEl.classList.add('bg-blue-100');
        sessionTypeEl.classList.remove('bg-green-100');
      }
    }

    function startTimer() {
      if (isRunning) return;
      isRunning = true;
      startBtn.classList.add('opacity-50', 'cursor-not-allowed');
      
      timerInterval = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--;
          updateTimer();
        } else {
          clearInterval(timerInterval);
          isRunning = false;
          startBtn.classList.remove('opacity-50', 'cursor-not-allowed');
          
          // Play notification sound
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.play();
          
          // Use native notification instead of alert if possible
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(onBreak ? 'Break over! Time to work.' : 'Time for a break!');
          } else {
            alert(onBreak ? 'Break over! Time to work.' : 'Time for a break!');
          }
          
          // Increment session counter when work session completes
          if (!onBreak) {
            sessionsCompleted++;
            sessionCounterEl.textContent = sessionsCompleted;
          }
          
          switchSession();
          updateTimer();
          startTimer();
        }
      }, 1000);
    }

    function pauseTimer() {
      clearInterval(timerInterval);
      isRunning = false;
      startBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }

    function resetTimer() {
      clearInterval(timerInterval);
      isRunning = false;
      onBreak = false;
      timeLeft = workDuration;
      sessionsCompleted = 0;
      sessionCounterEl.textContent = '0';
      sessionTypeEl.textContent = 'Work Session';
      sessionTypeEl.classList.add('bg-blue-100');
      sessionTypeEl.classList.remove('bg-green-100');
      startBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      updateTimer();
    }

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    // Request notification permission
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    // Initialize
    updateTimer();
});



// for background

function changeBackground(img) {
  const body = document.getElementById("main-body");
  body.style.backgroundImage = `url('${img}')`;
  body.style.backgroundSize = "cover";
  body.style.backgroundRepeat = "no-repeat";
}


// for notes

const notesArea = document.getElementById("notes");

// Load saved notes
notesArea.value = localStorage.getItem("focusoraNotes") || "";

// Auto-save while typing
notesArea.addEventListener("input", () => {
  localStorage.setItem("focusoraNotes", notesArea.value);
});
