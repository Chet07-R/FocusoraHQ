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
