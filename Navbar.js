function initNavbar() {
    const profileIcon = document.getElementById('profile-icon');
    const profileBox = document.getElementById('profile-box');

    if (!profileIcon || !profileBox) return; // safety check

    profileIcon.addEventListener('click', () => {
        profileBox.classList.toggle('active');
    });

    document.addEventListener('click', (event) => {
        if (!profileBox.contains(event.target) && !profileIcon.contains(event.target)) {
            profileBox.classList.remove('active');
        }
    });
}