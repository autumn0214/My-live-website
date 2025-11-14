// Production-ready shimmer script (data-driven).
// - Reads destination list from <body data-destinations="costarica.html,panama.html,belize.html">
// - Adds .shimmer to header nav links and slide-over menu links that point to other destination pages.
// - Skips logo links (links that contain <img> or <svg>).
// - No console debug logs.
// Usage: include this script with defer (or before </body>) and add the data attribute to <body>.

(function () {
  // Read the comma-separated destination list from <body data-destinations="...">
  const body = document.body;
  const raw = (body && body.getAttribute && body.getAttribute('data-destinations')) || '';
  // Parse into normalized filenames (lowercase, trimmed)
  const destinationPages = raw.split(',')
    .map(s => (s || '').trim().toLowerCase())
    .filter(Boolean);

  // If no destinations provided, do nothing.
  if (!destinationPages.length) return;

  // Determine current page filename (e.g., "panama.html"). Treat root as index.html.
  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  // Query selectors tailored to your header layout:
  const selectors = [
    'header nav a[href$=".html"]', // top header nav anchors
    '#siteMenu nav a[href$=".html"]' // slide-over panel anchors
  ];

  // Collect anchors (map by filename to the anchor element)
  const anchors = new Map();

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(a => {
      if (!a || !a.getAttribute) return;
      // Skip anchors that contain images or SVGs (logo links)
      if (a.querySelector('img') || a.querySelector('svg')) return;
      const href = a.getAttribute('href');
      if (!href) return;
      const filename = href.split('/').pop().toLowerCase();
      if (!filename) return;
      // store first anchor found for this filename
      if (!anchors.has(filename)) anchors.set(filename, a);
    });
  });

  // Apply or remove .shimmer according to destination list and current page
  anchors.forEach((anchor, filename) => {
    if (destinationPages.includes(filename) && filename !== current) {
      anchor.classList.add('shimmer');
    } else {
      anchor.classList.remove('shimmer');
    }
  });

  // Optional: if your header is dynamically replaced/rehydrated, you can re-run the logic.
  // Expose a safe reapply function:
  window.__shimmerReapply = function() {
    // Re-run the anchor collection/apply step (keeps script idempotent)
    const newAnchors = new Map();
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(a => {
        if (!a || !a.getAttribute) return;
        if (a.querySelector('img') || a.querySelector('svg')) return;
        const href = a.getAttribute('href');
        if (!href) return;
        const filename = href.split('/').pop().toLowerCase();
        if (!filename) return;
        if (!newAnchors.has(filename)) newAnchors.set(filename, a);
      });
    });
    newAnchors.forEach((anchor, filename) => {
      if (destinationPages.includes(filename) && filename !== current) {
        anchor.classList.add('shimmer');
      } else {
        anchor.classList.remove('shimmer');
      }
    });
  };
})();
