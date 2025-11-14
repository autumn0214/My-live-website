// Adds .shimmer to header nav links on destination pages (excludes the current page).
// Tailored selectors: top nav inside the header and panel nav inside #siteMenu.
// Adjust destinationPages array if you add/remove pages.

(function () {
  const destinationPages = ['costarica.html', 'panama.html', 'belize.html'];

  // Determine current page filename (e.g., "panama.html"). Treat root as index.html.
  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  // Selectors tailored to your header markup:
  const selectors = [
    'header .max-w-7xl nav a[href$=".html"]', // top header nav (desktop)
    '#siteMenu nav a[href$=".html"]',         // slide-over panel links
    'header a[href$=".html"]:not(#siteMenu a[href$=".html"])' // fallback catch-all for header anchors
  ];

  // Gather anchors (use a Set to dedupe)
  const anchors = new Map(); // map by normalized href => element
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(a => {
      if (!a || !a.getAttribute) return;
      // skip anchors that are the logo or contain images/SVGs
      if (a.querySelector('img') || a.querySelector('svg')) return;
      // normalize href to filename only
      try {
        const href = a.getAttribute('href');
        if (!href) return;
        const filename = href.split('/').pop().toLowerCase();
        if (!filename) return;
        anchors.set(filename, a);
      } catch (e) {
        // ignore malformed hrefs
      }
    });
  });

  // Apply shimmer only to destination links that are NOT the current page
  anchors.forEach((anchor, filename) => {
    if (destinationPages.includes(filename) && filename !== current) {
      anchor.classList.add('shimmer');
      // make sure it is keyboard-focusable and has a sensible hover/focus pause
      anchor.setAttribute('tabindex', anchor.getAttribute('tabindex') || '0');
    } else {
      anchor.classList.remove('shimmer');
    }
  });

  // Optional: observe DOM changes (useful if header markup is injected later)
  const observer = new MutationObserver((mutations) => {
    // re-run the logic if header links change
    // (simple approach: re-call this module by reloading the page or manually invoking)
  });
  // To avoid overhead: we do not observe by default. If you need it, uncomment next lines:
  // const headerEl = document.querySelector('header');
  // if (headerEl) observer.observe(headerEl, { childList: true, subtree: true });

})();
