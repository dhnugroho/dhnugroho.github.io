/**
 * Lazy Mockup SVGs
 * Project mockups ship as empty <svg data-lazy-svg="..."> placeholders
 * (the viewBox keeps their size). When one nears the viewport its file is
 * fetched and its children are moved inline, so page CSS and the
 * arch-layer inspector keep working on it.
 */

function loadMockup(svg) {
  const src = svg.getAttribute('data-lazy-svg');
  svg.removeAttribute('data-lazy-svg');

  fetch(src)
    .then(function (res) {
      if (!res.ok) throw new Error(res.status + ' ' + src);
      return res.text();
    })
    .then(function (text) {
      const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
      const root = doc.documentElement;
      if (root.nodeName !== 'svg') throw new Error('Invalid SVG ' + src);

      const frag = document.createDocumentFragment();
      Array.from(root.childNodes).forEach(function (node) {
        frag.appendChild(document.importNode(node, true));
      });
      svg.appendChild(frag);
    })
    .catch(function (err) {
      console.warn('Mockup load failed:', err);
    });
}

export function initLazyMockups() {
  const placeholders = document.querySelectorAll('svg[data-lazy-svg]');
  if (!placeholders.length) return;

  if (!('IntersectionObserver' in window)) {
    placeholders.forEach(loadMockup);
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      loadMockup(entry.target);
    });
  }, { rootMargin: '600px 0px' });

  placeholders.forEach(function (svg) { observer.observe(svg); });
}
