const articlesGrid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
const loadMoreBtn = document.querySelector('button');

// Store the original article cards
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


// For sidebar to be coloured when on a specific anchor tag 
const tocLinks = document.querySelectorAll('.toc-link');
  const sections = [];

  // Collect all sections
  tocLinks.forEach(link => {
    const id = link.getAttribute('href').substring(1);
    const section = document.getElementById(id);
    if (section) {
      sections.push({ id: id, element: section });
    }
  });

  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.element.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        current = section.id;
      }
    });
    
    tocLinks.forEach(link => {
      link.classList.remove('active-toc');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active-toc');
      }
    });
  });