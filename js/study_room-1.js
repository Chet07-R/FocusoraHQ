// ============ STATE ============
    let tasks = [];
    let currentFilter = 'all';
    let isDarkMode = false;

    // ============ TASKS ============
    function addTask() {
      const input = document.getElementById('taskInput');
      if (input.value.trim() !== "") {
        const task = {
          id: Date.now(),
          text: input.value,
          completed: false,
          priority: 'normal',
          createdAt: new Date()
        };
        tasks.push(task);
        input.value = "";
        saveTasks();
        renderTasks();
        updateTaskCount();
        showNotification('✅', 'Task Added', 'Task added to your list!');
      }
    }

    function toggleTask(id) {
      const task = tasks.find(t => t.id === id);
      if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateTaskCount();
        if (task.completed) {
          showNotification('🎉', 'Completed!', 'Great job finishing that task!');
        }
      }
    }

    function deleteTask(id) {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      renderTasks();
      updateTaskCount();
      showNotification('🗑️', 'Deleted', 'Task removed from list');
    }

    function filterTasks(filter) {
      currentFilter = filter;
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.className = 'filter-btn flex-1 px-3 py-2 rounded-lg bg-white/10 text-white/70 text-xs hover:bg-white/20 transition-all';
      });
      const activeBtn = filter === 'all' ? 'filterAll' : filter === 'high' ? 'filterHigh' : 'filterNormal';
      document.getElementById(activeBtn).className = 'filter-btn flex-1 px-3 py-2 rounded-lg bg-indigo-500/30 text-white text-xs font-semibold transition-all';
      renderTasks();
    }

    function clearCompleted() {
      const beforeCount = tasks.length;
      tasks = tasks.filter(t => !t.completed);
      const removed = beforeCount - tasks.length;
      if (removed > 0) {
        saveTasks();
        renderTasks();
        updateTaskCount();
        showNotification('🧹', 'Cleaned Up', `Removed ${removed} completed task(s)`);
      }
    }

    function renderTasks() {
      const list = document.getElementById('taskList');
      const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'all') return true;
        return task.priority === currentFilter;
      });

      list.innerHTML = filteredTasks.map(task => {
        return `
          <li class="bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-lg flex items-start gap-3 group hover:bg-white/15 transition-all ${task.completed ? 'opacity-60' : ''}">
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
              onchange="toggleTask(${task.id})"
              class="mt-1 w-5 h-5 rounded border-white/30 bg-white/10 checked:bg-indigo-500 cursor-pointer">
            <div class="flex-1">
              <span class="${task.completed ? 'line-through text-white/50' : 'text-white'}">
                ${task.text}
              </span>
            </div>
            <button onclick="deleteTask(${task.id})" 
              class="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all">
              ✖
            </button>
          </li>
        `;
      }).join('');
    }

    function updateTaskCount() {
      const active = tasks.filter(t => !t.completed).length;
      document.getElementById('taskCount').textContent = `${active} active`;
    }

    function saveTasks() {
      localStorage.setItem('focusora_tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
      const saved = localStorage.getItem('focusora_tasks');
      if (saved) {
        tasks = JSON.parse(saved);
        renderTasks();
        updateTaskCount();
      }
    }

    // ============ NOTES ============
    function updateCharCount() {
      const area = document.getElementById('notesArea');
      const text = area ? area.innerText || '' : '';
      const count = text.length;
      document.getElementById('charCount').textContent = `${count} characters`;
    }

    function saveNotes() {
      const area = document.getElementById('notesArea');
      const notes = area ? area.innerHTML : '';
      localStorage.setItem('focusora_notes', notes);
      showNotification('💾', 'Saved!', 'Your notes have been saved');
    }

    function downloadNotes() {
      const area = document.getElementById('notesArea');
      const notes = area ? area.innerText : '';
      const blob = new Blob([notes], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `focusora-notes-${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification('📥', 'Downloaded!', 'Notes saved to your device');
    }

    function formatText(format) {
      // Use execCommand for contenteditable to apply formatting visually
      const area = document.getElementById('notesArea');
      if (!area) return;
      area.focus();
      if (format === 'bold') document.execCommand('bold');
      if (format === 'italic') document.execCommand('italic');
      if (format === 'underline') document.execCommand('underline');
      updateCharCount();
    }

    function insertBullet() {
      const area = document.getElementById('notesArea');
      if (!area) return;
      area.focus();
      document.execCommand('insertUnorderedList');
      updateCharCount();
    }

    function loadNotes() {
      const notes = localStorage.getItem('focusora_notes');
      if (notes) {
        document.getElementById('notesArea').innerHTML = notes;
        updateCharCount();
      }
    }

    // Auto-save notes (contenteditable)
    let notesTimeout;
    const notesAreaEl = document.getElementById('notesArea');
    if (notesAreaEl) {
      notesAreaEl.addEventListener('input', () => {
        clearTimeout(notesTimeout);
        notesTimeout = setTimeout(saveNotes, 2000);
        updateCharCount();
      });
    }

    // ============ FILES ============
    function uploadFile() {
      const fileInput = document.getElementById('uploadNotes');
      const list = document.getElementById('uploadedNotes');
      
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const files = getFiles();
        
        files.push({
          id: Date.now(),
          name: file.name,
          size: (file.size / 1024).toFixed(2) + ' KB',
          uploadedAt: new Date().toLocaleString()
        });
        
        saveFiles(files);
        renderFiles();
        fileInput.value = "";
        showNotification('📤', 'Uploaded!', file.name);
      }
    }

    function renderFiles() {
      const list = document.getElementById('uploadedNotes');
      const files = getFiles();
      
      list.innerHTML = files.map(file => `
        <li class="flex items-center justify-between bg-white/10 p-2 rounded-lg hover:bg-white/20 transition">
          <div class="flex-1">
            <div class="text-sm">📎 ${file.name}</div>
            <div class="text-xs text-white/60">${file.size} • ${file.uploadedAt}</div>
          </div>
          <button onclick="deleteFile(${file.id})" class="text-red-400 hover:text-red-300 text-xs ml-2">✖</button>
        </li>
      `).join('');
    }

    function deleteFile(id) {
      const files = getFiles().filter(f => f.id !== id);
      saveFiles(files);
      renderFiles();
      showNotification('🗑️', 'Deleted', 'File removed');
    }

    function getFiles() {
      const files = localStorage.getItem('focusora_files');
      return files ? JSON.parse(files) : [];
    }

    function saveFiles(files) {
      localStorage.setItem('focusora_files', JSON.stringify(files));
    }

    // ============ PANELS ============
    function openPanel(id) {
      document.querySelectorAll('aside').forEach(p => p.classList.add('translate-x-full'));
      document.getElementById(id).classList.remove('translate-x-full');
      document.getElementById('mainContainer').style.transform = "translateX(-20rem)";
    }

    function closePanels() {
      document.querySelectorAll('aside').forEach(p => p.classList.add('translate-x-full'));
      document.getElementById('mainContainer').style.transform = "translateX(0)";
    }

    // ============ CHAT ============
    function sendChat() {
      const input = document.getElementById('chatInput');
      const chatBox = document.getElementById('chatBox');
      
      if (input.value.trim() !== "") {
        const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const div = document.createElement('div');
        div.className = "bg-emerald-500/20 p-3 rounded-lg text-right";
        div.innerHTML = `
          <div class="text-xs text-white/60 mb-1">You • ${time}</div>
          <div>${input.value}</div>
        `;
        chatBox.appendChild(div);
        input.value = "";
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }

    // ============ BACKGROUND ============
    function changeBackground(url) {
      if (url) {
        document.getElementById('bgLayer').style.backgroundImage = `url(${url})`;
        localStorage.setItem('focusora_bg', url);
        showNotification('🎨', 'Background Changed', 'New ambiance applied');
        // Close the background selector panel after choosing (mirror music behavior)
        const panel = document.getElementById('bgSelectorPanel');
        if (panel && panel.classList.contains('opacity-100')) toggleBgSelector();
      }
    }

    function toggleBgSelector() {
      const panel = document.getElementById('bgSelectorPanel');
      const isVisible = panel.classList.contains('opacity-100');
      
      if (isVisible) {
        panel.classList.remove('opacity-100', 'translate-y-0');
        panel.classList.add('opacity-0', 'translate-y-6', 'pointer-events-none');
      } else {
        panel.classList.remove('opacity-0', 'translate-y-6', 'pointer-events-none');
        panel.classList.add('opacity-100', 'translate-y-0');
      }
    }

    // Alias for the top control bar button which used `toggleBgPanel()` in markup
    function toggleBgPanel() {
      toggleBgSelector();
    }

    function adjustBlur(value) {
      // Map slider range (0-10) to a readable UI blur (0-4px) to keep text legible
      const maxUIBlur = 4; // px - maximum blur applied to UI elements
      const uiBlur = (Number(value) / 10) * maxUIBlur;
      // Set CSS variable so overlay uses backdrop-filter blur while content stays sharp
      const targets = document.querySelectorAll('.item-blur');
      targets.forEach(el => {
        el.style.setProperty('--ui-blur', `${uiBlur}px`);
      });
    }

    function adjustBrightness(value) {
      // Only adjust brightness on the background layer; blur for UI items is handled separately
      const bg = document.getElementById('bgLayer');
      if (bg) bg.style.filter = `brightness(${value}%)`;
    }

    // ============ MUSIC ============
    function toggleMusicPanel() {
      const panel = document.getElementById('musicPanel');
      const isVisible = panel.classList.contains('opacity-100');
      
      if (isVisible) {
        panel.classList.remove('opacity-100', 'translate-y-0');
        panel.classList.add('opacity-0', 'translate-y-6', 'pointer-events-none');
      } else {
        panel.classList.remove('opacity-0', 'translate-y-6', 'pointer-events-none');
        panel.classList.add('opacity-100', 'translate-y-0');
      }
    }

    function changeMusic(playlistId) {
      const player = document.getElementById('spotifyPlayer');
      player.src = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`;
      toggleMusicPanel();
      showNotification('🎵', 'Music Changed', 'Enjoy your new playlist');
    }

    // ============ DARK MODE ============
    function toggleDarkMode() {
      isDarkMode = !isDarkMode;
      document.documentElement.classList.toggle('dark', isDarkMode);
      localStorage.setItem('focusora_dark', isDarkMode ? '1' : '0');
      const icon = document.querySelector('nav button:last-child');
      if (icon) icon.textContent = isDarkMode ? '☀️' : '🌙';
      showNotification(isDarkMode ? '🌙' : '☀️', 'Theme Changed', isDarkMode ? 'Dark mode enabled' : 'Light mode enabled');
    }

    // ============ NOTIFICATIONS ============
    function showNotification(icon, title, message) {
      document.getElementById('notifIcon').textContent = icon;
      document.getElementById('notifTitle').textContent = title;
      document.getElementById('notifMessage').textContent = message;
      
      const notif = document.getElementById('notification');
      notif.style.transform = 'translateX(0)';
      
      setTimeout(() => hideNotification(), 3000);
    }

    function hideNotification() {
      document.getElementById('notification').style.transform = 'translateX(200%)';
    }

    // ============ INIT ============
    // Populate study room info panel (from URL params or localStorage fallback)
    function populateRoomInfo() {
      const params = new URLSearchParams(window.location.search);
      const rid = params.get('roomId') || localStorage.getItem('focusora_roomId') || 'SR-' + (Math.floor(Math.random()*9000)+1000);
      const rname = params.get('roomName') || localStorage.getItem('focusora_roomName') || 'Focus Study Room';
      const creator = params.get('createdBy') || localStorage.getItem('focusora_roomCreator') || 'Host';
      const members = params.get('members') || localStorage.getItem('focusora_roomMembers') || '3';

      const elId = document.getElementById('roomId');
      const elName = document.getElementById('roomName');
      const elCreator = document.getElementById('roomCreator');
      const elMembers = document.getElementById('roomMembers');

      if (elId) elId.textContent = rid;
      if (elName) elName.textContent = rname;
      if (elCreator) elCreator.textContent = creator;
      if (elMembers) elMembers.textContent = members;

      // store to local for next visits
      localStorage.setItem('focusora_roomId', rid);
      localStorage.setItem('focusora_roomName', rname);
      localStorage.setItem('focusora_roomCreator', creator);
      localStorage.setItem('focusora_roomMembers', members);

      const joinBtn = document.getElementById('joinRoomBtn');
      if (joinBtn) {
        joinBtn.onclick = function() {
          showNotification('👉', 'Joining Room', `Joining ${rname}...`);
          // open participants as a simple 'joined' action
          openPanel('participantsPanel');
        };
      }
    }

    function copyRoomId() {
      const rid = document.getElementById('roomId') ? document.getElementById('roomId').textContent : '';
      if (!rid) return showNotification('⚠️', 'Not available', 'No room id to copy');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(rid).then(() => {
          showNotification('📋', 'Copied', 'Room ID copied to clipboard');
        }).catch(() => {
          showNotification('❌', 'Failed', 'Could not copy to clipboard');
        });
      } else {
        const ta = document.createElement('textarea');
        ta.value = rid;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); showNotification('📋', 'Copied', 'Room ID copied to clipboard'); }
        catch(e){ showNotification('❌', 'Failed', 'Could not copy to clipboard'); }
        ta.remove();
      }
    }
    
    window.onload = function() {
      loadTasks();
      loadNotes();
      renderFiles();
      
      const savedBg = localStorage.getItem('focusora_bg');
      if (savedBg) {
        document.getElementById('bgLayer').style.backgroundImage = `url(${savedBg})`;
      }
      // restore dark mode preference
      const savedDark = localStorage.getItem('focusora_dark');
      if (savedDark === '1') {
        isDarkMode = true;
        document.documentElement.classList.add('dark');
        const icon = document.querySelector('nav button:last-child');
        if (icon) icon.textContent = '☀️';
      }
  // populate room info panel
  populateRoomInfo();
    };