

// Note: To-Do is handled by study_room-1.js (taskInput/taskList/taskCount). Legacy todo functions removed.











// Pomodoro Timer with SIMPLE Audio notification
document.addEventListener('DOMContentLoaded', () => {
    
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








// Notes: managed by study_room-1.js (notesArea contenteditable). Removed legacy textarea code to avoid conflicts.


// ====== Persistent Notes and To-Do ======

// NOTES - Save & Load
document.addEventListener('DOMContentLoaded', () => {
  const notesArea = document.getElementById('notesArea');
  if (notesArea) {
    // Load saved notes
    const savedNotes = localStorage.getItem('userNotes');
    if (savedNotes) notesArea.innerHTML = savedNotes;

    // Save notes on input
    notesArea.addEventListener('input', () => {
      localStorage.setItem('userNotes', notesArea.innerHTML);
    });
  }

  // TO-DO LIST - Save & Load
  const taskInput = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList');
  const taskCount = document.getElementById('taskCount');

  if (taskList) {
    const savedTasks = JSON.parse(localStorage.getItem('userTasks')) || [];
    renderTasks(savedTasks);

    // Add task function
    window.addTask = function() {
      const taskText = taskInput.value.trim();
      if (taskText === "") return;
      savedTasks.push({ text: taskText, done: false });
      localStorage.setItem('userTasks', JSON.stringify(savedTasks));
      renderTasks(savedTasks);
      taskInput.value = "";
    };

    // Render task list
    function renderTasks(tasks) {
      taskList.innerHTML = "";
      tasks.forEach((task, i) => {
        const li = document.createElement('li');
        li.className = `flex justify-between items-center p-3 rounded-lg border border-white/20 bg-white/10`;
        li.innerHTML = `
          <span class="flex-1 cursor-pointer ${task.done ? 'line-through opacity-60' : ''}" onclick="toggleTask(${i})">${task.text}</span>
          <button onclick="deleteTask(${i})" class="ml-3 text-red-400 hover:text-red-600 transition">🗑️</button>
        `;
        taskList.appendChild(li);
      });
      taskCount.textContent = `${tasks.length} tasks`;
    }

    // Toggle task done/undone
    window.toggleTask = function(index) {
      savedTasks[index].done = !savedTasks[index].done;
      localStorage.setItem('userTasks', JSON.stringify(savedTasks));
      renderTasks(savedTasks);
    };

    // Delete task
    window.deleteTask = function(index) {
      savedTasks.splice(index, 1);
      localStorage.setItem('userTasks', JSON.stringify(savedTasks));
      renderTasks(savedTasks);
    };
  }
});

/* ---------- UPLOADED NOTES (persist in localStorage) ---------- */
  const uploadInput = document.getElementById('uploadNotes');
  const uploadedList = document.getElementById('uploadedNotes');

  // load stored uploads
  const savedUploads = JSON.parse(localStorage.getItem('uploadedNotes')) || [];
  renderUploads(savedUploads);

  // attach global upload handler (HTML button calls uploadFile())
  window.uploadFile = function() {
    const files = (uploadInput && uploadInput.files) ? Array.from(uploadInput.files) : [];
    if (!files.length) {
      alert('Please choose a file to upload.');
      return;
    }

    // limit per-file size (soft guard for localStorage)
    const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

    // read each file as dataURL and save
    let reads = files.map(file => {
      return new Promise((resolve) => {
        if (file.size > MAX_FILE_BYTES) {
          // skip large files
          resolve({ skipped: true, name: file.name, reason: 'size' });
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target.result;
          resolve({
            skipped: false,
            entry: {
              name: file.name,
              type: file.type || 'application/octet-stream',
              size: file.size,
              dataUrl,
              uploadedAt: new Date().toISOString()
            }
          });
        };
        reader.onerror = () => {
          resolve({ skipped: true, name: file.name, reason: 'read_error' });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(reads).then(results => {
      let anyAdded = false;
      results.forEach(r => {
        if (r.skipped) {
          console.warn('Skipped upload:', r.name, r.reason);
        } else if (r.entry) {
          savedUploads.push(r.entry);
          anyAdded = true;
        }
      });

      try {
        // try to save - localStorage may throw if quota exceeded
        localStorage.setItem('uploadedNotes', JSON.stringify(savedUploads));
        if (anyAdded) {
          renderUploads(savedUploads);
          // clear file input
          uploadInput.value = "";
          alert('Upload saved.');
        } else {
          alert('No files were added. Files larger than 5 MB are skipped to avoid storage issues.');
        }
      } catch (e) {
        console.error('Saving uploaded files failed:', e);
        alert('Failed to save uploads — storage might be full. Consider removing some saved items or use a backend.');
      }
    });
  };

  // render uploads list
  function renderUploads(list) {
    if (!uploadedList) return;
    uploadedList.innerHTML = '';
    if (!list.length) {
      uploadedList.innerHTML = '<li class="text-white/70">No uploaded notes yet.</li>';
      return;
    }

    list.forEach((entry, index) => {
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between p-2 rounded-md';

      // show name + small meta, and download link
      const meta = document.createElement('div');
      meta.className = 'flex-1 truncate';
      const nameEl = document.createElement('a');
      nameEl.href = entry.dataUrl;
      nameEl.download = entry.name;
      nameEl.title = entry.name;
      nameEl.className = 'underline text-sm truncate';
      nameEl.textContent = entry.name;
      meta.appendChild(nameEl);

      const info = document.createElement('div');
      info.className = 'text-xs text-white/60 ml-3';
      const sizeKb = Math.round(entry.size/1024);
      info.textContent = ` ${sizeKb} KB • ${new Date(entry.uploadedAt).toLocaleString()}`;

      const right = document.createElement('div');
      right.className = 'flex items-center gap-2 ml-4';
      const openBtn = document.createElement('a');
      openBtn.href = entry.dataUrl;
      openBtn.target = '_blank';
      openBtn.className = 'px-2 py-1 bg-white/5 rounded text-sm';
      openBtn.textContent = 'Open';
      openBtn.rel = 'noopener noreferrer';

      const dlBtn = document.createElement('a');
      dlBtn.href = entry.dataUrl;
      dlBtn.download = entry.name;
      dlBtn.className = 'px-2 py-1 bg-white/5 rounded text-sm';
      dlBtn.textContent = 'Download';

      const delBtn = document.createElement('button');
      delBtn.className = 'ml-2 text-red-400 hover:text-red-600 text-sm';
      delBtn.textContent = 'Delete';
      delBtn.onclick = () => {
        if (!confirm(`Delete "${entry.name}" from saved uploads?`)) return;
        savedUploads.splice(index, 1);
        try {
          localStorage.setItem('uploadedNotes', JSON.stringify(savedUploads));
        } catch (e) {
          console.error('Could not update uploads after delete', e);
        }
        renderUploads(savedUploads);
      };

      li.appendChild(meta);
      li.appendChild(info);
      right.appendChild(openBtn);
      right.appendChild(dlBtn);
      right.appendChild(delBtn);
      li.appendChild(right);

      uploadedList.appendChild(li);
    });
  }

  // small helper: escape HTML for text nodes (used in task rendering)
  function escapeHtml(str) {
    return (str + '').replace(/[&<>"'`=\/]/g, function(s) {
      return {
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;',
        "'": '&#39;', '/': '&#x2F;', '`': '&#x60;', '=': '&#x3D;'
      }[s];
    });
  }