
// Dark mode toggle functionality
        const darkModeToggle = document.getElementById('darkModeToggle');
        
        darkModeToggle.addEventListener('click', () => {
            const html = document.documentElement;
            const isDark = html.classList.contains('dark');
            
            if (isDark) {
                html.classList.remove('dark');
                localStorage.setItem('dark-mode', 'false');
            } else {
                html.classList.add('dark');
                localStorage.setItem('dark-mode', 'true');
            }
        });

        // Animate progress bars on page load
        window.addEventListener('load', function() {
            const progressBars = document.querySelectorAll('.bg-gradient-to-r.from-indigo-500');
            progressBars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.width = bar.style.width;
                }, index * 100);
            });
        });

        

        // Load and apply saved theme preference immediately (before page renders)
        function applyTheme() {
            const savedTheme = localStorage.getItem('focusora-theme');
            
            if (savedTheme) {
                // User has a saved preference - use it
                if (savedTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            } else {
                // No saved preference - check system preference
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('focusora-theme', 'dark');
                } else {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('focusora-theme', 'light');
                }
            }
        }
        
        // Apply theme immediately
        applyTheme();

