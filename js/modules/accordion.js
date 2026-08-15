/* ============================================
   PROJECT SHOWCASE — Accordion + Carousel System
   Matches notes-carousel-viewport slider behavior:
   - 2 items per slide on desktop, 1 on mobile
   - Slide navigation (prev/next buttons, dots, counter)
   - Touch swipe support
   - Collapsible accordion items within slides
   ============================================ */

export function initAccordion() {
  const viewport = document.querySelector('.pj-carousel-viewport');
  const container = document.querySelector('.pj-accordion');

  if (!container) return;

  const track = container;
  let items = Array.from(viewport ? viewport.querySelectorAll('.pj-accordion-item') : container.querySelectorAll('.pj-accordion-item'));

  if (!items.length) return;

  // Sort items by data-date descending
  items.sort((a, b) => {
    const dateA = a.getAttribute('data-date') || '1970-01-01';
    const dateB = b.getAttribute('data-date') || '1970-01-01';
    return new Date(dateB) - new Date(dateA);
  });

  // Update index numbers (01, 02...)
  items.forEach((item, index) => {
    const indexEl = item.querySelector('.pj-index');
    if (indexEl) {
      indexEl.textContent = String(index + 1).padStart(2, '0');
    }
  });

  if (!viewport) {
    // Fallback standard vertical accordion if viewport markup absent
    initFallbackAccordion(track, items);
    return;
  }

  const prevBtn = viewport.querySelector('.pj-nav-prev');
  const nextBtn = viewport.querySelector('.pj-nav-next');
  const dotsContainer = viewport.querySelector('.pj-carousel-dots');
  const counterEl = viewport.querySelector('.pj-carousel-counter');

  let currentSlide = 0;
  let itemsPerSlide = 2;
  let totalSlides = 1;
  let dots = [];

  let touchStartX = 0;
  let touchEndX = 0;
  let isSwiping = false;

  function calcLayout() {
    itemsPerSlide = window.innerWidth <= 768 ? 1 : 2;
    totalSlides = Math.ceil(items.length / itemsPerSlide);
    if (currentSlide >= totalSlides) {
      currentSlide = Math.max(0, totalSlides - 1);
    }
  }

  function buildSlides() {
    track.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const slide = document.createElement('div');
      slide.className = 'pj-slide';
      slide.setAttribute('data-slide', i);

      const start = i * itemsPerSlide;
      const end = Math.min(start + itemsPerSlide, items.length);

      for (let j = start; j < end; j++) {
        slide.appendChild(items[j]);
      }

      track.appendChild(slide);
    }
  }

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    dots = [];

    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = 'pj-carousel-dot' + (i === currentSlide ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to project slide ' + (i + 1));
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
      dots.push(dot);
    }
  }

  function updateDots() {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function updateCounter() {
    if (!counterEl) return;
    const start = currentSlide * itemsPerSlide + 1;
    const end = Math.min(start + itemsPerSlide - 1, items.length);
    counterEl.textContent = `Showing ${start} – ${end} of ${items.length} projects`;
  }

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

  function slideTrack() {
    const offset = -(currentSlide * 100);
    track.style.transform = `translateX(${offset}%)`;
  }

  function closeAllAccordions() {
    items.forEach((item) => {
      if (item.classList.contains('pj-active') || item.classList.contains('expanded')) {
        closeItem(item);
      }
    });
  }

  function goToSlide(index) {
    if (index < 0 || index >= totalSlides || index === currentSlide) return;
    closeAllAccordions();
    currentSlide = index;
    slideTrack();
    updateDots();
    updateCounter();
    updateNavButtons();
    const currentSlideEl = track.querySelector(`.pj-slide[data-slide="${currentSlide}"]`);
    if (currentSlideEl) {
      const firstInSlide = currentSlideEl.querySelector('.pj-accordion-item');
      if (firstInSlide) openItem(firstInSlide);
    }
  }

  function closeItem(item) {
    item.classList.remove('pj-active', 'expanded');
    const header = item.querySelector('.pj-accordion-header');
    if (header) header.setAttribute('aria-expanded', 'false');
    const body = item.querySelector('.pj-accordion-body');
    const inner = item.querySelector('.inner-content') || item.querySelector('.pj-accordion-inner');
    if (inner) inner.classList.remove('active');
    if (body) {
      body.classList.remove('active');
      const h = body.scrollHeight;
      body.style.maxHeight = h + 'px';
      requestAnimationFrame(() => {
        body.style.maxHeight = '0px';
      });
    }
  }

  function openItem(item) {
    item.classList.add('pj-active', 'expanded');
    const header = item.querySelector('.pj-accordion-header');
    if (header) header.setAttribute('aria-expanded', 'true');
    const body = item.querySelector('.pj-accordion-body');
    const inner = item.querySelector('.inner-content') || item.querySelector('.pj-accordion-inner');
    if (inner) inner.classList.add('active');
    if (body) {
      body.classList.add('active');
      body.style.maxHeight = body.scrollHeight + 'px';
      const onEnd = () => {
        if (item.classList.contains('pj-active') || item.classList.contains('expanded')) {
          body.style.maxHeight = 'none';
        }
        body.removeEventListener('transitionend', onEnd);
      };
      body.addEventListener('transitionend', onEnd);
    }
  }

  function toggleItem(clickedItem) {
    const isOpen = clickedItem.classList.contains('pj-active') || clickedItem.classList.contains('expanded');
    const currentSlideEl = track.querySelector(`.pj-slide[data-slide="${currentSlide}"]`) || track;
    const slideItems = currentSlideEl.querySelectorAll('.pj-accordion-item');
    slideItems.forEach((item) => {
      if (item !== clickedItem && (item.classList.contains('pj-active') || item.classList.contains('expanded'))) {
        closeItem(item);
      }
    });

    if (isOpen) {
      closeItem(clickedItem);
    } else {
      openItem(clickedItem);
    }
  }

  // Event Listeners
  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

  items.forEach((item) => {
    const header = item.querySelector('.pj-accordion-header');
    if (!header) return;

    header.addEventListener('click', () => toggleItem(item));
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleItem(item);
      }
    });
  });

  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToSlide(currentSlide + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToSlide(currentSlide - 1);
    }
  });

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchEndX = touchStartX;
    isSwiping = true;
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    touchEndX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    if (!isSwiping) return;
    isSwiping = false;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToSlide(currentSlide + 1);
      else goToSlide(currentSlide - 1);
    }
  }, { passive: true });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const prevItemsPerSlide = itemsPerSlide;
      calcLayout();
      if (prevItemsPerSlide !== itemsPerSlide) {
        closeAllAccordions();
        buildSlides();
        buildDots();
        updateCounter();
        updateNavButtons();
        slideTrack();
        const firstSlideEl = track.querySelector('.pj-slide[data-slide="0"]');
        if (firstSlideEl) {
          const firstItem = firstSlideEl.querySelector('.pj-accordion-item');
          if (firstItem) openItem(firstItem);
        }
      }
    }, 200);
  });

  // Init
  calcLayout();
  buildSlides();
  buildDots();
  updateCounter();
  updateNavButtons();
  slideTrack();

  const countEl = document.querySelector('.pj-count-num');
  if (countEl) countEl.textContent = items.length;

  const firstSlideEl = track.querySelector('.pj-slide[data-slide="0"]');
  if (firstSlideEl) {
    const firstItem = firstSlideEl.querySelector('.pj-accordion-item');
    if (firstItem) openItem(firstItem);
  }
}

function initFallbackAccordion(container, items) {
  items.forEach((item) => {
    container.appendChild(item);
    const header = item.querySelector('.pj-accordion-header');
    if (!header) return;
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('pj-active') || item.classList.contains('expanded');
      items.forEach((other) => {
        if (other !== item) {
          other.classList.remove('pj-active', 'expanded');
          const b = other.querySelector('.pj-accordion-body');
          if (b) b.style.maxHeight = '0px';
        }
      });
      if (isOpen) {
        item.classList.remove('pj-active', 'expanded');
        const b = item.querySelector('.pj-accordion-body');
        if (b) b.style.maxHeight = '0px';
      } else {
        item.classList.add('pj-active', 'expanded');
        const b = item.querySelector('.pj-accordion-body');
        if (b) b.style.maxHeight = 'none';
      }
    });
  });
  if (items.length > 0) {
    items[0].classList.add('pj-active', 'expanded');
    const b = items[0].querySelector('.pj-accordion-body');
    if (b) b.style.maxHeight = 'none';
  }
}

