function initNavbar() {
    const profileIcon = document.getElementById('profile-icon');
    const profileBox = document.getElementById('profile-box');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    // Profile Dropdown Toggle
    if (profileIcon && profileBox) {
        const closeDropdown = () => { profileBox.classList.remove('active'); profileBox.setAttribute('aria-hidden','true'); };
        const openDropdown = () => { profileBox.classList.add('active'); profileBox.setAttribute('aria-hidden','false'); };
        const toggleDropdown = () => { profileBox.classList.contains('active') ? closeDropdown() : openDropdown(); };

        profileIcon.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent immediate close
            toggleDropdown();
        });

        document.addEventListener('click', (event) => {
            if (!profileBox.contains(event.target) && !profileIcon.contains(event.target)) {
                closeDropdown();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeDropdown();
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

    // Active link highlight (keeps underline on current page)
    try {
        // Get current file name without extension (e.g., my_space, Blog, leaderboard)
        const path = window.location.pathname;
        let page = path.split('/').pop() || '';
        if (page.endsWith('.html')) {
            page = page.slice(0, -5);
        }

        // Treat blog detail pages as Blog
        const isBlogDetail = /^Blog(-\d+)?$/i.test(page);

        document.querySelectorAll('.nav-link').forEach((link) => {
            const name = link.getAttribute('data-page');
            if (!name) return;
            if (page === name || (isBlogDetail && name.toLowerCase() === 'blog')) {
                link.classList.add('active');
            }
        });
    } catch (e) {
        // No-op if navbar not yet injected
    }
}
