// Update slider display values
document.getElementById('pomodoroWork').addEventListener('input', function() {
    document.getElementById('pomodoroWorkDisplay').textContent = this.value;
});

document.getElementById('pomodoroBreak').addEventListener('input', function() {
    document.getElementById('pomodoroBreakDisplay').textContent = this.value;
});

// Profile picture preview
document.getElementById('profilePic').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profilePreview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Load user profile on page load
window.addEventListener('DOMContentLoaded', function() {
    loadUserProfile();
});

function loadUserProfile() {
    // Fetch from localStorage or your backend API
    const userData = JSON.parse(localStorage.getItem('userProfile')) || {
        username: 'john_doe',
        email: 'john@example.com',
        bio: 'Passionate about productivity and deep work',
        pomodoroWork: 25,
        pomodoroBreak: 5,
        theme: 'forest',
        showOnLeaderboard: true,
        allowMessages: true,
        notifications: true,
        totalFocusTime: '156h',
        currentStreak: '12 days',
        profilePic: 'https://via.placeholder.com/150'
    };

    // Populate form fields
    document.getElementById('username').value = userData.username;
    document.getElementById('email').value = userData.email;
    document.getElementById('bio').value = userData.bio;
    document.getElementById('pomodoroWork').value = userData.pomodoroWork;
    document.getElementById('pomodoroBreak').value = userData.pomodoroBreak;
    document.getElementById('theme').value = userData.theme;
    document.getElementById('showOnLeaderboard').checked = userData.showOnLeaderboard;
    document.getElementById('allowMessages').checked = userData.allowMessages;
    document.getElementById('notifications').checked = userData.notifications;
    document.getElementById('totalFocusTime').textContent = userData.totalFocusTime;
    document.getElementById('currentStreak').textContent = userData.currentStreak;
    document.getElementById('profilePreview').src = userData.profilePic;

    // Update display values
    document.getElementById('pomodoroWorkDisplay').textContent = userData.pomodoroWork;
    document.getElementById('pomodoroBreakDisplay').textContent = userData.pomodoroBreak;
}

// Form submission
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const userData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        bio: document.getElementById('bio').value,
        pomodoroWork: document.getElementById('pomodoroWork').value,
        pomodoroBreak: document.getElementById('pomodoroBreak').value,
        theme: document.getElementById('theme').value,
        showOnLeaderboard: document.getElementById('showOnLeaderboard').checked,
        allowMessages: document.getElementById('allowMessages').checked,
        notifications: document.getElementById('notifications').checked,
        profilePic: document.getElementById('profilePreview').src
    };

    // Save to localStorage (or send to backend API)
    localStorage.setItem('userProfile', JSON.stringify(userData));

    // Show success message
    alert('Profile updated successfully!');
    // Optionally redirect after save
    // window.location.href = '/profile';
});

function cancelEdit() {
    if (confirm('Discard changes?')) {
        window.history.back();
        // Or redirect: window.location.href = '/profile';
    }
}
