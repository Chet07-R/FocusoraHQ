const articlesGrid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
const loadMoreBtn = document.querySelector('button');

// Store the original article cards
if (articlesGrid && loadMoreBtn) {
    const originalArticles = Array.from(articlesGrid.children);

    loadMoreBtn.addEventListener('click', function() {
        // Simply duplicate all original articles
        originalArticles.forEach((article) => {
            const clone = article.cloneNode(true);
            articlesGrid.appendChild(clone);
        });
        
        // Smooth scroll to show new content
        setTimeout(() => {
            const newArticles = articlesGrid.children;
            const firstNewArticle = newArticles[newArticles.length - originalArticles.length];
            firstNewArticle.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    });
}


// TOC Slider functionality
const tocLinks = document.querySelectorAll('.toc-link');
const tocIndicator = document.querySelector('.toc-indicator');

if (tocLinks.length > 0 && tocIndicator) {
  const sections = [];
  let currentActive = '';
  let ticking = false;

  // Collect all sections
  tocLinks.forEach(link => {
    const id = link.getAttribute('href').substring(1);
    const section = document.getElementById(id);
    if (section) {
      sections.push({ id: id, element: section });
    }
  });

  // Function to update slider position - optimized
  function updateSlider(activeLink) {
    if (!activeLink || !tocIndicator) return;
    
    // Use getBoundingClientRect for accurate positioning
    const linkRect = activeLink.getBoundingClientRect();
    const containerRect = activeLink.parentElement.getBoundingClientRect();
    
    const topPosition = linkRect.top - containerRect.top;
    
    // Use transform for better performance
    tocIndicator.style.transform = `translateY(${topPosition}px)`;
    tocIndicator.style.height = `${linkRect.height}px`;
  }

  // Optimized scroll handler with requestAnimationFrame
  function onScroll() {
    if (sections.length === 0) return;
    
    let current = '';
    const scrollPos = window.scrollY;
    
    // Find current section
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionTop = section.element.offsetTop - 150;
      if (scrollPos >= sectionTop) {
        current = section.id;
        break;
      }
    }
    
    // Only update if changed
    if (current && current !== currentActive) {
      currentActive = current;
      
      tocLinks.forEach(link => {
        link.classList.remove('active-toc');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active-toc');
          updateSlider(link);
        }
      });
    }
  }

  // Throttled scroll listener using requestAnimationFrame
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Click handler for manual navigation
  tocLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        // Update current active
        currentActive = targetId;
        
        // Smooth scroll to section
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Update active state and slider
        tocLinks.forEach(l => l.classList.remove('active-toc'));
        link.classList.add('active-toc');
        updateSlider(link);
      }
    });
  });

  // Initialize slider position on page load
  setTimeout(() => {
    const firstLink = tocLinks[0];
    if (firstLink) {
      currentActive = firstLink.getAttribute('href').substring(1);
      firstLink.classList.add('active-toc');
      updateSlider(firstLink);
    }
  }, 100);
}