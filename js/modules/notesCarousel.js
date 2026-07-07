/**
 * Notes Section — Accordion + Carousel Slider
 *
 * Features:
 * - Carousel: horizontal slide navigation with prev/next buttons, dot indicators
 * - Accordion: collapsible note items, only one open per slide
 * - Responsive: 2 notes/slide on desktop, 1 on mobile
 * - Touch swipe support on mobile
 * - Keyboard accessible
 * - Collapses all accordions on slide change
 * - Re-triggers spine animation on first expand
 */

export function initNotesCarousel() {
  const viewport = document.querySelector('.notes-carousel-viewport');
  if (!viewport) return;

  const track = viewport.querySelector('.notes-carousel-track');
  const items = Array.from(viewport.querySelectorAll('.notes-accordion-item'));
  const prevBtn = viewport.querySelector('.notes-nav-prev');
  const nextBtn = viewport.querySelector('.notes-nav-next');
  const dotsContainer = viewport.querySelector('.notes-carousel-dots');
  const counterEl = viewport.querySelector('.notes-carousel-counter');

  if (!track || !items.length) return;

  let currentSlide = 0;
  let itemsPerSlide = 2;
  let totalSlides = 1;
  let dots = [];

  // ─── Touch / Swipe State ───
  let touchStartX = 0;
  let touchEndX = 0;
  let isSwiping = false;

  /**
   * Calculate responsive items-per-slide and total slides.
   */
  function calcLayout() {
    itemsPerSlide = window.innerWidth <= 768 ? 1 : 2;
    totalSlides = Math.ceil(items.length / itemsPerSlide);

    // Clamp current slide
    if (currentSlide >= totalSlides) {
      currentSlide = Math.max(0, totalSlides - 1);
    }
  }

  /**
   * Build slide groups and position them in the track.
   */
  function buildSlides() {
    // Clear existing slides
    track.innerHTML = '';

    for (let i = 0; i < totalSlides; i++) {
      const slide = document.createElement('div');
      slide.className = 'notes-slide';
      slide.setAttribute('data-slide', i);

      const start = i * itemsPerSlide;
      const end = Math.min(start + itemsPerSlide, items.length);

      for (let j = start; j < end; j++) {
        slide.appendChild(items[j]);
      }

      track.appendChild(slide);
    }
  }

  /**
   * Build pagination dots.
   */
  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    dots = [];

    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = 'notes-carousel-dot' + (i === currentSlide ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', function () {
        goToSlide(i);
      });
      dotsContainer.appendChild(dot);
      dots.push(dot);
    }
  }

  /**
   * Update the active dot.
   */
  function updateDots() {
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  /**
   * Update the counter text.
   */
  function updateCounter() {
    if (!counterEl) return;
    const start = currentSlide * itemsPerSlide + 1;
    const end = Math.min(start + itemsPerSlide - 1, items.length);
    counterEl.textContent = 'Showing ' + start + ' \u2013 ' + end + ' of ' + items.length + ' notes';
  }

  /**
   * Update nav button states (disabled when at edges).
   */
  function updateNavButtons() {
    if (prevBtn) {
      prevBtn.classList.toggle('disabled', currentSlide === 0);
      prevBtn.setAttribute('aria-disabled', currentSlide === 0 ? 'true' : 'false');
    }
    if (nextBtn) {
      nextBtn.classList.toggle('disabled', currentSlide === totalSlides - 1);
      nextBtn.setAttribute('aria-disabled', currentSlide === totalSlides - 1 ? 'true' : 'false');
    }
  }

  /**
   * Slide the track to the current position.
   */
  function slideTrack() {
    const offset = -(currentSlide * 100);
    track.style.transform = 'translateX(' + offset + '%)';
  }

  /**
   * Close all accordion items.
   */
  function closeAllAccordions() {
    items.forEach(function (item) {
      if (item.classList.contains('notes-acc-active')) {
        closeAccordionItem(item);
      }
    });
  }

  /**
   * Navigate to a specific slide.
   */
  function goToSlide(index) {
    if (index < 0 || index >= totalSlides || index === currentSlide) return;

    // Collapse all open accordions before switching
    closeAllAccordions();

    currentSlide = index;
    slideTrack();
    updateDots();
    updateCounter();
    updateNavButtons();
  }

  /**
   * Close a single accordion item with smooth animation.
   */
  function closeAccordionItem(item) {
    item.classList.remove('notes-acc-active');
    var header = item.querySelector('.notes-accordion-header');
    if (header) header.setAttribute('aria-expanded', 'false');
    var body = item.querySelector('.notes-accordion-body');
    if (body) {
      // Set current height first, then animate to 0
      body.style.maxHeight = body.scrollHeight + 'px';
      // Force reflow
      body.offsetHeight;
      body.style.maxHeight = '0px';
    }
  }

  /**
   * Open a single accordion item with smooth animation.
   */
  function openAccordionItem(item) {
    item.classList.add('notes-acc-active');
    var header = item.querySelector('.notes-accordion-header');
    if (header) header.setAttribute('aria-expanded', 'true');
    var body = item.querySelector('.notes-accordion-body');
    if (body) {
      body.style.maxHeight = body.scrollHeight + 'px';
      // After transition, remove max-height to allow natural resizing
      var onEnd = function () {
        if (item.classList.contains('notes-acc-active')) {
          body.style.maxHeight = 'none';
        }
        body.removeEventListener('transitionend', onEnd);
      };
      body.addEventListener('transitionend', onEnd);
    }

    // Re-trigger spine animation for timelines inside this note
    var spineWraps = item.querySelectorAll('.spine-wrap');
    spineWraps.forEach(function (sw) {
      if (!sw.classList.contains('spine-animated')) {
        // Small delay for the accordion to open first
        setTimeout(function () {
          sw.classList.add('spine-animated');
        }, 200);
      }
    });

    // Smooth scroll the accordion item into view
    setTimeout(function () {
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 150);
  }

  /**
   * Toggle an accordion item.
   */
  function toggleAccordion(clickedItem) {
    var isOpen = clickedItem.classList.contains('notes-acc-active');

    // Close all items in the current slide (accordion behavior)
    var currentSlideEl = track.querySelector('.notes-slide[data-slide="' + currentSlide + '"]');
    if (currentSlideEl) {
      var slideItems = currentSlideEl.querySelectorAll('.notes-accordion-item');
      slideItems.forEach(function (item) {
        if (item !== clickedItem && item.classList.contains('notes-acc-active')) {
          closeAccordionItem(item);
        }
      });
    }

    // Toggle clicked
    if (isOpen) {
      closeAccordionItem(clickedItem);
    } else {
      openAccordionItem(clickedItem);
    }
  }

  // ─── Initialize ───
  function init() {
    calcLayout();
    buildSlides();
    buildDots();
    updateCounter();
    updateNavButtons();
    slideTrack();

    // Remove spine-animated from all timeline wraps so they animate on expand
    items.forEach(function (item) {
      var spineWraps = item.querySelectorAll('.spine-wrap');
      spineWraps.forEach(function (sw) {
        sw.classList.remove('spine-animated');
      });
    });
  }

  // ─── Event Listeners ───

  // Nav buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      goToSlide(currentSlide - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      goToSlide(currentSlide + 1);
    });
  }

  // Accordion headers
  items.forEach(function (item) {
    var header = item.querySelector('.notes-accordion-header');
    if (!header) return;

    header.addEventListener('click', function () {
      toggleAccordion(item);
    });

    header.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleAccordion(item);
      }
    });
  });

  // Keyboard carousel navigation
  viewport.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToSlide(currentSlide + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToSlide(currentSlide - 1);
    }
  });

  // Touch swipe support
  track.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
    touchEndX = touchStartX;
    isSwiping = true;
  }, { passive: true });

  track.addEventListener('touchmove', function (e) {
    if (!isSwiping) return;
    touchEndX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', function () {
    if (!isSwiping) return;
    isSwiping = false;

    var diff = touchStartX - touchEndX;
    var threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe left -> next
        goToSlide(currentSlide + 1);
      } else {
        // Swipe right -> prev
        goToSlide(currentSlide - 1);
      }
    }
  }, { passive: true });

  // Responsive resize
  var resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      var prevItemsPerSlide = itemsPerSlide;
      calcLayout();

      if (prevItemsPerSlide !== itemsPerSlide) {
        // Items-per-slide changed, rebuild
        closeAllAccordions();
        buildSlides();
        buildDots();
        updateCounter();
        updateNavButtons();
        slideTrack();
      }
    }, 200);
  });

  // Initialize
  init();
}
