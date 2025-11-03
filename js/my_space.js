

// To do list
function addtask() {
    const taskInput = document.getElementById('input-task');
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    const newTask = document.createElement('li');
    const taskList = document.getElementById('task-list');

    newTask.innerHTML = `
        <div class="task-item flex items-center justify-between p-4 rounded-xl shadow-lg transition-all duration-300">
            <div class="flex items-center space-x-3 flex-1">
                <input type="checkbox" class="w-5 h-5 text-indigo-600 bg-white/80 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 transition-all duration-200" onchange="toggleTask(this)">
                <span class="text-gray-800 font-medium flex-1">${taskText}</span>
            </div>
            <button class="delete-btn ml-4 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-semibold rounded-lg shadow-md transition-all duration-200" onclick="deleteTask(this)">
                🗑️ Remove
            </button>
        </div>
    `;

    taskList.appendChild(newTask);
    taskInput.value = "";
    updateEmptyState();
}

function toggleTask(checkbox) {
    const taskText = checkbox.nextElementSibling;
    if (checkbox.checked) {
        taskText.classList.add('line-through', 'text-gray-500');
        taskText.style.opacity = '0.6';
    } else {
        taskText.classList.remove('line-through', 'text-gray-500');
        taskText.style.opacity = '1';
    }
}

function deleteTask(button) {
    const taskItem = button.closest('li');
    taskItem.style.transform = 'translateX(100%)';
    taskItem.style.opacity = '0';
    setTimeout(() => {
        taskItem.remove();
        updateEmptyState();
    }, 300);
}

function updateEmptyState() {
    const taskList = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');
    
    if (taskList.children.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }
}











// Pomodoro Timer with SIMPLE Audio notification
document.addEventListener('DOMContentLoaded', () => {
    updateEmptyState();
    
    let workDuration = 25 * 60;
    let breakDuration = 5 * 60;
    let timeLeft = workDuration;
    let timerInterval;
    let isRunning = false;
    let onBreak = false;
    let sessionsCompleted = 0;
    
    // Create Audio object for beep sound (using free online sound)
    let beepSound = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');

    const timerEl = document.getElementById('timer');
    const sessionTypeEl = document.getElementById('sessionType');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const workInput = document.getElementById('workInput');
    const breakSelect = document.getElementById('breakSelect');
    const sessionCounterEl = document.getElementById('sessionCounter');
    
    document.title = 'Focusora - My Space';
    
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
    }

    function switchSession() {
      onBreak = !onBreak;
      timeLeft = onBreak ? breakDuration : workDuration;
      sessionTypeEl.textContent = onBreak ? 'Break Session' : 'Work Session';
      
      if (onBreak) {
        sessionTypeEl.classList.add('bg-green-600');
        sessionTypeEl.classList.remove('bg-blue-100');
      } else {
        sessionTypeEl.classList.add('bg-blue-100');
        sessionTypeEl.classList.remove('bg-green-600');
      }
    }

    function startTimer(auto = false) {
      if (!auto && isRunning) return;
      
      isRunning = true;
      startBtn.classList.add("opacity-50", "cursor-not-allowed");
      
      timerInterval = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--;
          updateTimer();
        } else {
          // Timer complete
          clearInterval(timerInterval);
          isRunning = false;
          startBtn.classList.remove("opacity-50", "cursor-not-allowed");

          // PLAY BEEP SOUND - Simple and reliable
          beepSound.currentTime = 0; // Reset to start
          beepSound.play().catch(e => console.log('Sound error:', e));

          showNotification();

          if (!onBreak) {
            sessionsCompleted++;
            sessionCounterEl.textContent = sessionsCompleted;
          }

          switchSession();
          updateTimer();
          
          // Auto-start next session after 1 second
          setTimeout(() => startTimer(true), 1000);
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
      sessionTypeEl.classList.add('bg-transparent');
      sessionTypeEl.classList.remove('bg-green-600');
      startBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      updateTimer();
      document.title = 'Focusora - My Space';
    }

    function showNotification() {
      if ("Notification" in window && Notification.permission === "granted") {
        const message = onBreak ? 'Work session complete! Time for a break.' : 'Break is over! Ready to work?';
        new Notification('Focusora - Pomodoro Timer', {
          body: message
        });
      }
    }

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    if ("Notification" in window) {
      Notification.requestPermission();
    }

    updateTimer();
});








// Background changer
function changeBackground(img) {
  const body = document.getElementById("main-body");
  body.style.backgroundImage = `url('${img}')`;
  body.style.backgroundSize = "cover";
  body.style.backgroundRepeat = "no-repeat";
}








// Notes
const notesArea = document.getElementById("notes");
notesArea.value = localStorage.getItem("focusoraNotes") || "";
notesArea.addEventListener("input", () => {
  localStorage.setItem("focusoraNotes", notesArea.value);
});
