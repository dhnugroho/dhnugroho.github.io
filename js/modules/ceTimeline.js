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
  if (timelines.length) {
    timelines.forEach(function (timeline) {
      const eraCols = timeline.querySelectorAll('.era-col');

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
        timeline.classList.add('spine-animated');
      }

      eraCols.forEach(function (col) {
        col.addEventListener('click', function (e) {
          handleExpand(col, eraCols);
        });

        col.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleExpand(col, eraCols);
          }
        });
      });

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

  // Initialize Crossroads Flow Timeline (Note 6 Modern Overhaul)
  initCrossroadsFlow();
}

/**
  * Applied ML Crossroads Flow Timeline Interactivity
  */
export function initCrossroadsFlow() {
  const flowWraps = document.querySelectorAll('.crossroads-flow-wrap');
  if (!flowWraps.length) return;

  flowWraps.forEach(function (wrap) {
    const stepNodes = wrap.querySelectorAll('.ml-step-node');
    const stageCards = wrap.querySelectorAll('.ml-stage-card');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            wrap.classList.add('ml-timeline-animated');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      observer.observe(wrap);
    } else {
      wrap.classList.add('ml-timeline-animated');
    }

    function setActiveStage(stageNum) {
      stepNodes.forEach(function (node) {
        const isMatch = node.getAttribute('data-step') === String(stageNum);
        node.classList.toggle('active', isMatch);
        node.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });

      stageCards.forEach(function (card) {
        const isMatch = card.getAttribute('data-stage') === String(stageNum);
        card.classList.toggle('active-card', isMatch);
      });
    }

    stepNodes.forEach(function (node) {
      node.addEventListener('click', function () {
        const stepNum = node.getAttribute('data-step');
        setActiveStage(stepNum);
      });

      node.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const stepNum = node.getAttribute('data-step');
          setActiveStage(stepNum);
        }
      });
    });

    stageCards.forEach(function (card) {
      card.addEventListener('click', function () {
        const stageNum = card.getAttribute('data-stage');
        setActiveStage(stageNum);
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const stageNum = card.getAttribute('data-stage');
          setActiveStage(stageNum);
        }
      });
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
    allCols.forEach(function (col) {
      if (col !== targetCol) {
        col.classList.remove('era-expanded');
        col.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (isExpanded) {
    targetCol.classList.remove('era-expanded');
    targetCol.setAttribute('aria-expanded', 'false');
  } else {
    targetCol.classList.add('era-expanded');
    targetCol.setAttribute('aria-expanded', 'true');

    if (isMobile) {
      setTimeout(function () {
        targetCol.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }
}

