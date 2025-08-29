function initNavbar() {
    const profileIcon = document.getElementById('profile-icon');
    const profileBox = document.getElementById('profile-box');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    // Profile Dropdown Toggle
    if (profileIcon && profileBox) {
        profileIcon.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent immediate close
            profileBox.classList.toggle('active');
        });

        document.addEventListener('click', (event) => {
            if (!profileBox.contains(event.target) && !profileIcon.contains(event.target)) {
                profileBox.classList.remove('active');
            }
        });
    }

    // Mobile Menu Toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
            mobileMenuBtn.classList.toggle('active'); // For hamburger → X animation
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.classList.remove('active');
            }
        });

        // Close mobile menu when clicking any menu link
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach((link) => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.classList.remove('active');
            });
        });

        // Reset on window resize (for desktop)
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024) {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.classList.remove('active');
            }
        });
    }

    // Dark mode functionality
    const darkToggle = document.getElementById('dark-toggle');
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.classList.add('dark');
        if (darkToggle) darkToggle.checked = true;
    }
    
    // Toggle dark mode
    if (darkToggle) {
        darkToggle.addEventListener('change', function() {
            if (this.checked) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
        });
    }
}
