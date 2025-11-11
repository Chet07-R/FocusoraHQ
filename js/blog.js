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

// ============================================
// LOAD MORE ARTICLES FUNCTIONALITY
// ============================================

if (articlesGrid && loadMoreBtn) {
    const originalArticles = Array.from(articlesGrid.children);
    loadMoreBtn.addEventListener('click', function() {
        originalArticles.forEach((article) => {
            const clone = article.cloneNode(true);
            articlesGrid.appendChild(clone);
        });
        setTimeout(() => {
            const newArticles = articlesGrid.children;
            const firstNewArticle = newArticles[newArticles.length - originalArticles.length];
            firstNewArticle.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    });
}


// ============================================
// TOC SLIDER FUNCTIONALITY (FIXED)
// ============================================
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

  // ⭐ FIXED: Update slider position with correct calculation
  function updateSlider(activeLink) {
    if (!activeLink || !tocIndicator) return;
    
    // Get the parent nav container
    const navContainer = tocIndicator.parentElement;
    if (!navContainer) return;
    
    // Calculate position relative to the nav container
    const navRect = navContainer.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    
    // Calculate the offset from the top of nav container
    const topPosition = linkRect.top - navRect.top + navContainer.scrollTop;
    
    // Apply the transform with proper positioning
    tocIndicator.style.transform = `translateY(${topPosition}px)`;
    tocIndicator.style.height = `${linkRect.height}px`;
    tocIndicator.style.width = '4px';
    tocIndicator.style.background = 'linear-gradient(to bottom, #3b82f6, #9333ea)';
    tocIndicator.style.opacity = '1';
    tocIndicator.style.borderRadius = '9999px';
  }

  // Optimized scroll handler
  function onScroll() {
    if (sections.length === 0) return;
    
    let current = '';
    const scrollPos = window.scrollY;
    
    // Find current section with better offset
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionTop = section.element.offsetTop - 200;
      if (scrollPos >= sectionTop) {
        current = section.id;
        break;
      }
    }
    
    // Update active state
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

  // Throttled scroll listener
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
        currentActive = targetId;
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        tocLinks.forEach(l => l.classList.remove('active-toc'));
        link.classList.add('active-toc');
        updateSlider(link);
      }
    });
  });

  // Initialize on page load
  setTimeout(() => {
    const firstLink = tocLinks[0];
    if (firstLink) {
      currentActive = firstLink.getAttribute('href').substring(1);
      firstLink.classList.add('active-toc');
      updateSlider(firstLink);
    }
  }, 100);

  // ⭐ FIX: Update slider on window resize
  window.addEventListener('resize', () => {
    const activeLink = document.querySelector('.toc-link.active-toc');
    if (activeLink) {
      updateSlider(activeLink);
    }
  });
}
