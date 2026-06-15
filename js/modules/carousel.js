/**
 * Portfolio Carousel — Mobile Only
 * Manages pagination dots, active state tracking via IntersectionObserver,
 * and keyboard navigation. Activates only on screens ≤768px.
 */

function setupCarousel(gridSelector, dotsSelector, itemSelector) {
  const grid = document.querySelector(gridSelector);
  const dotsContainer = document.querySelector(dotsSelector);

  if (!grid || !dotsContainer) return null;

  let cards = [];
  let dots = [];
  let observer = null;
  let activeIndex = 0;
  let isActive = false;

  /**
   * Build pagination dots based on the number of cards.
   */
  function buildDots() {
    cards = Array.from(grid.querySelectorAll(itemSelector));
    dotsContainer.innerHTML = '';
    dots = [];

    cards.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', function () {
        scrollToCard(i);
      });
      dotsContainer.appendChild(dot);
      dots.push(dot);
    });
  }

  /**
   * Scroll a specific card into view with smooth scroll.
   */
  function scrollToCard(index) {
    if (!cards[index]) return;
    cards[index].scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    });
  }

  /**
   * Update the active dot indicator.
   */
  function setActiveDot(index) {
    if (index === activeIndex && dots[index] && dots[index].classList.contains('active')) return;
    activeIndex = index;
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === index);
    });
  }

  /**
   * IntersectionObserver callback: whichever card is most visible gets the active dot.
   */
  function handleIntersection(entries) {
    let bestIndex = activeIndex;
    let bestRatio = 0;

    entries.forEach(function (entry) {
      const idx = cards.indexOf(entry.target);
      if (idx === -1) return;
      if (entry.intersectionRatio > bestRatio) {
        bestRatio = entry.intersectionRatio;
        bestIndex = idx;
      }
    });

    if (bestRatio > 0.4) {
      setActiveDot(bestIndex);
    }
  }

  /**
   * Start observing card visibility inside the scroll container.
   */
  function startObserver() {
    if (observer) observer.disconnect();

    observer = new IntersectionObserver(handleIntersection, {
      root: grid,
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    cards.forEach(function (card) {
      observer.observe(card);
    });
  }

  /**
   * Activate the carousel (mobile only).
   */
  function activate() {
    if (isActive) return;
    isActive = true;
    buildDots();
    startObserver();
  }

  /**
   * Deactivate the carousel (desktop).
   */
  function deactivate() {
    if (!isActive) return;
    isActive = false;
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    dotsContainer.innerHTML = '';
    dots = [];
    activeIndex = 0;
  }

  // Keyboard arrow navigation
  grid.addEventListener('keydown', function (e) {
    if (!isActive) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = Math.min(activeIndex + 1, cards.length - 1);
      scrollToCard(next);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = Math.max(activeIndex - 1, 0);
      scrollToCard(prev);
    }
  });

  return {
    activate: activate,
    deactivate: deactivate
  };
}

export function initCarousel() {
  const mql = window.matchMedia('(max-width: 768px)');

  const portfolioCarousel = setupCarousel('.portfolio-grid', '.carousel-dots:not(.skills-carousel-dots)', '.portfolio-card');
  const skillsCarousel = setupCarousel('.skills-grid', '.skills-carousel-dots', '.skill-group');

  function handleMediaChange(e) {
    if (e.matches) {
      if (portfolioCarousel) portfolioCarousel.activate();
      if (skillsCarousel) skillsCarousel.activate();
    } else {
      if (portfolioCarousel) portfolioCarousel.deactivate();
      if (skillsCarousel) skillsCarousel.deactivate();
    }
  }

  mql.addEventListener('change', handleMediaChange);
  if (mql.matches) {
    if (portfolioCarousel) portfolioCarousel.activate();
    if (skillsCarousel) skillsCarousel.activate();
  }
}
