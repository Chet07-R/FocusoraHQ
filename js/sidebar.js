// Sidebar logic: fetch component, active section highlight, mobile toggle
(function(){
  const placeholder = document.querySelector('.app-sidebar');
  if(!placeholder) return;
  const isInPages = window.location.pathname.includes('/pages/');
  const basePath = isInPages ? '../' : './';

  fetch(`${basePath}components/sidebar.html`).then(r=>r.text()).then(html=>{
    placeholder.innerHTML = html; // inject full doc fragment
    // Execute embedded scripts inside fetched sidebar
    const parser = new DOMParser();
    const doc = parser.parseFromString(html,'text/html');
    doc.querySelectorAll('script').forEach(scr=>{ if(scr.textContent) { try{ eval(scr.textContent); }catch(e){ console.error('Sidebar embedded script error',e);} } });
    initSidebarEnhancements();
  }).catch(e=>console.error('Failed to load sidebar',e));
})();

function initSidebarEnhancements(){
  const links = Array.from(document.querySelectorAll('.link-base[href^="#"]'));
  const sectionMap = new Map();
  links.forEach(l=>{
    const id = l.getAttribute('href').replace('#','');
    const el = document.getElementById(id);
    if(el) sectionMap.set(id,{link:l,el});
  });

  // Add click handler for section highlighting
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.replace('#', '');
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          // Update active state
          links.forEach(a => a.classList.remove('sidebar-active'));
          this.classList.add('sidebar-active');
          
          // Get the actual card element (the div with rounded-2xl class inside the section)
          const card = targetSection.querySelector('.rounded-2xl');
          const elementToHighlight = card || targetSection;
          
          // Remove existing highlights
          document.querySelectorAll('.section-highlight').forEach(el => {
            el.classList.remove('section-highlight');
          });
          
          // Add highlight to the target
          elementToHighlight.classList.add('section-highlight');
          
          // Scroll to section with smooth behavior
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Remove highlight after animation completes
          setTimeout(() => {
            elementToHighlight.classList.remove('section-highlight');
          }, 2000);
        }
      }
    });
  });

  // Intersection Observer for active highlight (only when scrolling)
  let hasScrolled = false;
  window.addEventListener('scroll', () => { hasScrolled = true; }, { once: false });
  
  const observer = new IntersectionObserver((entries)=>{
    if (!hasScrolled) return; // Don't activate on initial page load
    entries.forEach(entry=>{
      const id = entry.target.id;
      const data = sectionMap.get(id);
      if(!data) return;
      if(entry.isIntersecting){
        links.forEach(a=>a.classList.remove('sidebar-active'));
        data.link.classList.add('sidebar-active');
      }
    });
  },{ rootMargin:'-40% 0px -50% 0px', threshold:0.1 });

  sectionMap.forEach(({el})=>observer.observe(el));

  // Mobile toggle logic
  const toggleBtn = document.getElementById('sidebar-toggle');
  const overlay = document.getElementById('sidebar-overlay');
  const sidebarContainer = document.getElementById('sidebar-container');
  if(toggleBtn && overlay && sidebarContainer){
    const open = ()=>{ sidebarContainer.classList.add('sidebar-open'); overlay.classList.remove('hidden'); };
    const close = ()=>{ sidebarContainer.classList.remove('sidebar-open'); overlay.classList.add('hidden'); };
    toggleBtn.addEventListener('click',()=>{
      if(sidebarContainer.classList.contains('sidebar-open')) close(); else open();
    });
    overlay.addEventListener('click',close);
  }

  // Active state for full-page links based on current path
  const current = window.location.pathname.split('/').pop().replace('.html','');
  if (current) {
    document.querySelectorAll('.link-base[data-page]').forEach(a=>{
      if(a.getAttribute('data-page')===current){ a.classList.add('sidebar-active'); }
    });
  }

  // Expand/Collapse sidebar functionality (desktop only)
  const expandBtn = document.getElementById('sidebar-expand-btn');
  if (expandBtn && sidebarContainer) {
    // Check for saved state or default to collapsed
    const savedState = localStorage.getItem('sidebarExpanded');
    const isExpanded = savedState === 'true';
    
    // Start collapsed by default (only on desktop)
    const isMobile = window.innerWidth < 768;
    if (!isMobile && !isExpanded) {
      sidebarContainer.classList.add('collapsed');
    }
    
    // Set initial arrow direction
    if (sidebarContainer.classList.contains('collapsed')) {
      expandBtn.querySelector('svg path').setAttribute('d', 'M9 5l7 7-7 7'); // Right arrow
    } else {
      expandBtn.querySelector('svg path').setAttribute('d', 'M15 19l-7-7 7-7'); // Left arrow
    }
    
    expandBtn.addEventListener('click', function() {
      const isCurrentlyCollapsed = sidebarContainer.classList.toggle('collapsed');
      localStorage.setItem('sidebarExpanded', !isCurrentlyCollapsed);
      
      // Update arrow direction
      if (isCurrentlyCollapsed) {
        expandBtn.querySelector('svg path').setAttribute('d', 'M9 5l7 7-7 7'); // Right arrow
      } else {
        expandBtn.querySelector('svg path').setAttribute('d', 'M15 19l-7-7 7-7'); // Left arrow
      }
    });
  }

  // Dark mode toggle in sidebar
  setTimeout(() => {
    const darkToggle = document.getElementById('sidebar-dark-toggle');
    
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Initialize dark mode state
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
      updateDarkModeIcon(true);
    } else {
      updateDarkModeIcon(false);
    }
    
    // Toggle dark mode on click
    if (darkToggle) {
      darkToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateDarkModeIcon(isDark);
      });
    }

    // Expose global fallback for onclick attribute
    window.toggleSidebarDarkMode = function(e){
      try{
        e && e.preventDefault && e.preventDefault();
        e && e.stopPropagation && e.stopPropagation();
      }catch(err){}
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateDarkModeIcon(isDark);
      return isDark;
    }

    function updateDarkModeIcon(isDark) {
      const darkIcon = document.querySelector('.dark-mode-icon');
      const lightIcon = document.querySelector('.light-mode-icon');
      if (darkIcon && lightIcon) {
        if (isDark) {
          darkIcon.classList.remove('hidden');
          lightIcon.classList.add('hidden');
        } else {
          darkIcon.classList.add('hidden');
          lightIcon.classList.remove('hidden');
        }
      }
    }
  }, 100);

  // Handle theme selector when sidebar is collapsed
  const themeSelector = document.querySelector('.theme-selector-wrapper');
  const themeSvg = themeSelector?.querySelector('svg');
  const themeSelect = document.getElementById('theme-selector');
  
  if (themeSvg && themeSelect) {
    themeSvg.addEventListener('click', function(e) {
      const sidebarContainer = document.getElementById('sidebar-container');
      if (sidebarContainer?.classList.contains('collapsed')) {
        e.stopPropagation();
        themeSelect.click();
      }
    });
  }
}
