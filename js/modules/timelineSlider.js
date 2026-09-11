/* ============================================
   CAREER TIMELINE — Interactive Scrubber Slider
   ============================================ */

export function initTimelineSlider() {
  const viewport = document.querySelector('.tl-rolling-viewport');
  if (!viewport) return;

  const spineBar  = viewport.querySelector('.tl-spine-bar');
  const track     = viewport.querySelector('.tl-rolling-track');
  const cards     = Array.from(viewport.querySelectorAll('.tl-rolling-card'));
  const nodes     = Array.from(viewport.querySelectorAll('.tl-spine-node'));
  const prevBtn   = viewport.querySelector('.tl-nav-prev');
  const nextBtn   = viewport.querySelector('.tl-nav-next');
  const counterEl = viewport.querySelector('.tl-rolling-counter');
  const progressEl = viewport.querySelector('.tl-spine-progress');

  if (!track || !cards.length) return;

  const totalSteps = cards.length;
  let currentStep  = 0;

  // ── Extract metadata from nodes ─────────────────────────────────────
  const nodeYears = nodes.map((n) => {
    const el = n.querySelector('.tl-node-year');
    return el ? el.textContent.trim() : '';
  });
  const nodeRoles = nodes.map((n) => {
    const el = n.querySelector('.tl-node-role');
    return el ? el.textContent.trim() : '';
  });

  // ── Build scrubber handle + floating tooltip ─────────────────────────
  const scrubber = document.createElement('div');
  scrubber.className = 'tl-scrubber-thumb';
  scrubber.setAttribute('aria-label', 'Career timeline milestone slider');
  scrubber.setAttribute('role', 'slider');
  scrubber.setAttribute('aria-valuemin', '0');
  scrubber.setAttribute('aria-valuemax', String(totalSteps - 1));
  scrubber.setAttribute('aria-valuenow', '0');
  scrubber.setAttribute('tabindex', '0');

  const tooltip = document.createElement('div');
  tooltip.className = 'tl-scrubber-tooltip';
  scrubber.appendChild(tooltip);

  if (spineBar) {
    spineBar.appendChild(scrubber);
  }

  // ── Get precise pixel center of any node dot relative to spineBar ───
  function getNodeCenter(index) {
    if (!nodes[index] || !spineBar) return 0;
    const dot = nodes[index].querySelector('.tl-node-dot') || nodes[index];
    const dotRect = dot.getBoundingClientRect();
    const barRect = spineBar.getBoundingClientRect();
    if (barRect.width === 0) {
      return totalSteps > 1 ? (index / (totalSteps - 1)) * 800 : 0;
    }
    return dotRect.left + dotRect.width / 2 - barRect.left;
  }

  // ── Core update slider function ─────────────────────────────────────
  function updateSlider(step, animate = true) {
    if (step < 0 || step >= totalSteps) return;
    currentStep = step;

    // Slide track
    track.style.transition = animate ? 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)' : 'none';
    track.style.transform  = `translateX(-${step * 100}%)`;

    // Active card
    cards.forEach((c, i) => {
      c.classList.toggle('active', i === step);
    });

    // Spine node states
    nodes.forEach((node, i) => {
      const isActive = i === step;
      node.classList.toggle('active', isActive);
      node.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    // Position scrubber thumb & spine progress bar
    const targetX = getNodeCenter(step);
    scrubber.style.transition = animate
      ? 'left 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.2s ease, transform 0.2s ease'
      : 'none';
    scrubber.style.left = `${targetX}px`;

    if (progressEl) {
      progressEl.style.transition = animate
        ? 'width 0.45s cubic-bezier(0.22, 1, 0.36, 1)'
        : 'none';
      progressEl.style.width = `${targetX}px`;
    }

    // Tooltip content
    const yearText = nodeYears[step] || '';
    const roleText = nodeRoles[step] || '';
    tooltip.textContent = roleText ? `${yearText} · ${roleText}` : yearText;

    // Counter
    if (counterEl) {
      counterEl.textContent = `${step + 1} of ${totalSteps}`;
    }

    // Prev / Next button states
    if (prevBtn) {
      prevBtn.classList.toggle('disabled', step === 0);
      prevBtn.setAttribute('aria-disabled', step === 0 ? 'true' : 'false');
    }
    if (nextBtn) {
      nextBtn.classList.toggle('disabled', step === totalSteps - 1);
      nextBtn.setAttribute('aria-disabled', step === totalSteps - 1 ? 'true' : 'false');
    }

    // Accessibility
    scrubber.setAttribute('aria-valuenow', String(step));
    scrubber.setAttribute('aria-valuetext', `${yearText} ${roleText}`);
  }

  // ── Drag & Scrub Physics ─────────────────────────────────────────────
  let isDragging = false;
  let minX = 0;
  let maxX = 0;

  function onDragStart(clientX) {
    isDragging = true;
    minX = getNodeCenter(0);
    maxX = getNodeCenter(totalSteps - 1);
    scrubber.classList.add('dragging');
    tooltip.classList.add('visible');
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
    onDragMove(clientX);
  }

  function onDragMove(clientX) {
    if (!isDragging || !spineBar) return;
    const barRect = spineBar.getBoundingClientRect();
    const rawX = clientX - barRect.left;
    const clampedX = Math.max(minX, Math.min(maxX, rawX));
    const fraction = maxX > minX ? (clampedX - minX) / (maxX - minX) : 0;

    // Move thumb & progress line with zero lag
    scrubber.style.transition = 'none';
    scrubber.style.left = `${clampedX}px`;
    if (progressEl) {
      progressEl.style.transition = 'none';
      progressEl.style.width = `${clampedX}px`;
    }

    // Real-time track slide
    track.style.transition = 'none';
    track.style.transform  = `translateX(${-fraction * (totalSteps - 1) * 100}%)`;

    // Real-time snap step
    const snapStep = Math.max(0, Math.min(totalSteps - 1, Math.round(fraction * (totalSteps - 1))));
    nodes.forEach((n, i) => n.classList.toggle('active', i === snapStep));
    cards.forEach((c, i) => c.classList.toggle('active', i === snapStep));

    const yearText = nodeYears[snapStep] || '';
    const roleText = nodeRoles[snapStep] || '';
    tooltip.textContent = roleText ? `${yearText} · ${roleText}` : yearText;

    if (counterEl) {
      counterEl.textContent = `${snapStep + 1} of ${totalSteps}`;
    }
  }

  function onDragEnd(clientX) {
    if (!isDragging || !spineBar) return;
    isDragging = false;
    scrubber.classList.remove('dragging');
    tooltip.classList.remove('visible');
    document.body.style.userSelect = '';
    document.body.style.cursor = '';

    const barRect = spineBar.getBoundingClientRect();
    const rawX = clientX - barRect.left;
    const clampedX = Math.max(minX, Math.min(maxX, rawX));
    const fraction = maxX > minX ? (clampedX - minX) / (maxX - minX) : 0;
    const snapStep = Math.max(0, Math.min(totalSteps - 1, Math.round(fraction * (totalSteps - 1))));

    updateSlider(snapStep, true);
  }

  // Mouse drag events
  scrubber.addEventListener('mousedown', (e) => {
    e.preventDefault();
    onDragStart(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) onDragMove(e.clientX);
  });

  window.addEventListener('mouseup', (e) => {
    if (isDragging) onDragEnd(e.clientX);
  });

  // Touch drag events (prevent page scroll during horizontal scrub)
  scrubber.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      onDragStart(e.touches[0].clientX);
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
      onDragMove(e.touches[0].clientX);
    }
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (isDragging && e.changedTouches.length) {
      onDragEnd(e.changedTouches[0].clientX);
    }
  }, { passive: true });

  // ── Click on spine bar to jump ───────────────────────────────────────
  if (spineBar) {
    spineBar.addEventListener('click', (e) => {
      if (e.target === scrubber || scrubber.contains(e.target)) return;
      if (e.target.closest('.tl-spine-node')) return; // handled by node click
      const barRect = spineBar.getBoundingClientRect();
      const rawX = e.clientX - barRect.left;
      const startX = getNodeCenter(0);
      const endX   = getNodeCenter(totalSteps - 1);
      const clampedX = Math.max(startX, Math.min(endX, rawX));
      const fraction = endX > startX ? (clampedX - startX) / (endX - startX) : 0;
      const snapStep = Math.max(0, Math.min(totalSteps - 1, Math.round(fraction * (totalSteps - 1))));
      updateSlider(snapStep, true);
    });
  }

  // ── Spine node click / keyboard ──────────────────────────────────────
  nodes.forEach((node, i) => {
    node.addEventListener('click', () => updateSlider(i, true));
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        updateSlider(i, true);
      }
    });
  });

  // ── Prev / Next navigation buttons ───────────────────────────────────
  if (prevBtn) {
    prevBtn.addEventListener('click', () => updateSlider(currentStep - 1, true));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => updateSlider(currentStep + 1, true));
  }

  // ── Keyboard accessibility on scrubber thumb ─────────────────────────
  scrubber.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      updateSlider(currentStep + 1, true);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      updateSlider(currentStep - 1, true);
    } else if (e.key === 'Home') {
      e.preventDefault();
      updateSlider(0, true);
    } else if (e.key === 'End') {
      e.preventDefault();
      updateSlider(totalSteps - 1, true);
    }
  });

  // ── Keyboard on viewport ─────────────────────────────────────────────
  viewport.addEventListener('keydown', (e) => {
    if (e.target === scrubber || e.target.closest('.tl-spine-node')) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      updateSlider(currentStep + 1, true);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      updateSlider(currentStep - 1, true);
    }
  });

  // ── Touch swipe on track ─────────────────────────────────────────────
  let touchStartX = 0;
  let touchStartY = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diffX = touchStartX - e.changedTouches[0].screenX;
    const diffY = touchStartY - e.changedTouches[0].screenY;
    // Ensure horizontal gesture dominates vertical scroll
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) updateSlider(currentStep + 1, true);
      else updateSlider(currentStep - 1, true);
    }
  }, { passive: true });

  // ── Resize handler for pixel-accurate alignment ──────────────────────
  let resizeTimer;
  function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateSlider(currentStep, false);
    }, 80);
  }
  window.addEventListener('resize', handleResize, { passive: true });

  // Also observe container size changes (e.g. font loaded, layout shift)
  if (typeof ResizeObserver !== 'undefined' && spineBar) {
    const ro = new ResizeObserver(() => handleResize());
    ro.observe(spineBar);
  }

  // ── Initial paint ────────────────────────────────────────────────────
  // Delay by one tick to ensure layout and fonts are rendered
  requestAnimationFrame(() => {
    updateSlider(0, false);
  });
}
