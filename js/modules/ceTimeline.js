/**
 * Career Evolution Timeline — Interactive Module
 * 
 * Features:
 * - Scroll-triggered entrance animations (staggered)
 * - Spine progress bar animated on scroll
 * - Click/tap to expand ethics insights (mobile)
 * - Keyboard accessible (Enter/Space to toggle)
 * - Auto-expand era 5 on desktop for visual impact
 */

export function initCeTimeline() {
  const timelines = document.querySelectorAll('.spine-wrap');
  if (!timelines.length) return;

  timelines.forEach(function (timeline) {
    const eraCols = timeline.querySelectorAll('.era-col');

    // ─── Scroll-triggered entrance animation ───
    if ('IntersectionObserver' in window) {
      const timelineObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            timeline.classList.add('spine-animated');
            timelineObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.2,
        rootMargin: '0px 0px -40px 0px'
      });

      timelineObserver.observe(timeline);
    } else {
      // Fallback: show immediately
      timeline.classList.add('spine-animated');
    }

    // ─── Click/tap to expand cards ───
    eraCols.forEach(function (col) {
      col.addEventListener('click', function (e) {
        handleExpand(col, eraCols);
      });

      // Keyboard support
      col.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleExpand(col, eraCols);
        }
      });
    });

    // ─── Touch feedback ───
    eraCols.forEach(function (col) {
      col.addEventListener('touchstart', function () {
        col.style.willChange = 'transform';
      }, { passive: true });

      col.addEventListener('touchend', function () {
        col.style.willChange = 'auto';
      }, { passive: true });
    });
  });
}

/**
 * Handle expand/collapse of a timeline era card.
 * On mobile: only one card expanded at a time (accordion).
 * On desktop: toggle freely.
 */
function handleExpand(targetCol, allCols) {
  var isMobile = window.innerWidth <= 640;
  var isExpanded = targetCol.classList.contains('era-expanded');

  if (isMobile) {
    // Accordion: collapse all others
    allCols.forEach(function (col) {
      if (col !== targetCol) {
        col.classList.remove('era-expanded');
        col.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Toggle target
  if (isExpanded) {
    targetCol.classList.remove('era-expanded');
    targetCol.setAttribute('aria-expanded', 'false');
  } else {
    targetCol.classList.add('era-expanded');
    targetCol.setAttribute('aria-expanded', 'true');

    // Smooth scroll into view on mobile
    if (isMobile) {
      setTimeout(function () {
        targetCol.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }
}
