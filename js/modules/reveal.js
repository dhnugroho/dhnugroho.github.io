export function initReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          entry.target.querySelectorAll('.skill-bar[data-w]').forEach(function (bar) {
            bar.style.width = bar.getAttribute('data-w') + '%';
            bar.style.transform = 'scaleX(1)';
          });
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealElements.forEach(function (el) { el.classList.add('visible'); });
  }

  // TECH STRIP INFINITE SCROLL
  // Items are pre-duplicated in HTML (data-strip-cloned="true"), so JS cloning
  // is only a fallback for cases where the HTML wasn't updated.
  const techStripInner = document.querySelector('.tech-strip-inner');
  if (techStripInner && !techStripInner.dataset.stripCloned) {
    const originals = Array.from(techStripInner.children);
    originals.forEach(function (child) {
      techStripInner.appendChild(child.cloneNode(true));
    });
    techStripInner.dataset.stripCloned = 'true';
  }
}
