/* ============================================
   CAREER TIMELINE — Modern Rolling Slider
   ============================================ */

export function initTimelineSlider() {
  const viewport = document.querySelector('.tl-rolling-viewport');
  if (!viewport) return;

  const track = viewport.querySelector('.tl-rolling-track');
  const cards = Array.from(viewport.querySelectorAll('.tl-rolling-card'));
  const nodes = Array.from(viewport.querySelectorAll('.tl-spine-node'));
  const prevBtn = viewport.querySelector('.tl-nav-prev');
  const nextBtn = viewport.querySelector('.tl-nav-next');
  const counterEl = viewport.querySelector('.tl-rolling-counter');
  const progressEl = viewport.querySelector('.tl-spine-progress');

  if (!track || !cards.length) return;

  let currentStep = 0;
  const totalSteps = cards.length;

  let touchStartX = 0;
  let touchEndX = 0;
  let isSwiping = false;

  function updateSlider(step) {
    if (step < 0 || step >= totalSteps) return;

    currentStep = step;

    // Slide track
    const offset = -(currentStep * 100);
    track.style.transform = `translateX(${offset}%)`;

    // Active card class
    cards.forEach((card, i) => {
      card.classList.toggle('active', i === currentStep);
    });

    // Spine node active states
    nodes.forEach((node, i) => {
      const isActive = i === currentStep;
      node.classList.toggle('active', isActive);
      node.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    // Update spine progress bar width
    if (progressEl) {
      const pct = (currentStep / (totalSteps - 1)) * 100;
      progressEl.style.width = `${pct}%`;
    }

    // Update counter
    if (counterEl) {
      counterEl.textContent = `${currentStep + 1} of ${totalSteps}`;
    }

    // Update navigation buttons
    if (prevBtn) {
      prevBtn.classList.toggle('disabled', currentStep === 0);
      prevBtn.setAttribute('aria-disabled', currentStep === 0 ? 'true' : 'false');
    }
    if (nextBtn) {
      nextBtn.classList.toggle('disabled', currentStep === totalSteps - 1);
      nextBtn.setAttribute('aria-disabled', currentStep === totalSteps - 1 ? 'true' : 'false');
    }
  }

  // Event Listeners for spine nodes
  nodes.forEach((node, i) => {
    node.addEventListener('click', () => updateSlider(i));
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        updateSlider(i);
      }
    });
  });

  // Prev / Next button listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => updateSlider(currentStep - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => updateSlider(currentStep + 1));
  }

  // Keyboard navigation
  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      updateSlider(currentStep + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      updateSlider(currentStep - 1);
    }
  });

  // Touch swipe support
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
      if (diff > 0) updateSlider(currentStep + 1);
      else updateSlider(currentStep - 1);
    }
  }, { passive: true });

  // Init
  updateSlider(0);
}
