const rankingList = document.getElementById("rankingList");
const loadMoreBtn = document.getElementById("loadMoreBtn");

// Store the original ranking cards (divs)
const originalCards = Array.from(rankingList.children);

// Find the highest current rank number to continue from there
let totalRanks = 0;
originalCards.forEach(card => {
    const rankElement = card.querySelector("span");
    if (rankElement) {
        const rankNumber = parseInt(rankElement.textContent);
        if (rankNumber > totalRanks) {
            totalRanks = rankNumber;
        }
    }
});

loadMoreBtn.addEventListener("click", function () {
    originalCards.forEach((card) => {
        // Only skip cards containing the YOU highlight
        const youBadge = card.querySelector('span.bg-blue-600');
        if (youBadge && youBadge.textContent.includes('YOU')) {
            return; // SKIP card with YOU badge
        }
        const clone = card.cloneNode(true);

        // Increment rank counter for next available number
        totalRanks += 1;

        // Update ranking number
        const rankNum = clone.querySelector("span");
        if (rankNum) {
            rankNum.textContent = totalRanks;
        }

        rankingList.appendChild(clone);
    });
});







// Counter Animation Function
        function animateCounter(element) {
            const target = parseInt(element.getAttribute('data-target'));
            const suffix = element.getAttribute('data-suffix') || '';
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Format the number
                let displayValue = Math.floor(current);
                
                // Add comma formatting for large numbers
                if (displayValue >= 1000 && !suffix) {
                    displayValue = displayValue.toLocaleString();
                }
                
                element.textContent = displayValue + suffix;
            }, 16);
        }

        // Intersection Observer for triggering animation when visible
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    animateCounter(entry.target);
                }
            });
        }, observerOptions);

        // Start observing counter elements when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            const counters = document.querySelectorAll('.counter');
            counters.forEach(counter => {
                observer.observe(counter);
            });
        });