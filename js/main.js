import { initParticles } from './modules/particles.js';
import { initTyping } from './modules/typing.js';
import { initNavbar } from './modules/navbar.js';
import { initTheme } from './modules/theme.js';
import { initFocusMode } from './modules/focusMode.js';

// Non-critical modules deferred after initial paint
import { initReveal } from './modules/reveal.js';
import { initModal } from './modules/modal.js';
import { initForm } from './modules/form.js';
import { initCarousel } from './modules/carousel.js';
import { initCeTimeline } from './modules/ceTimeline.js';
import { initAccordion } from './modules/accordion.js';
import { initNotesCarousel } from './modules/notesCarousel.js';
import { initEnhancements } from './modules/enhancements.js';
import { initArchLayers } from './modules/archLayers.js';
import { initTimelineSlider } from './modules/timelineSlider.js';
import { initCursor } from './modules/cursor.js';

// Phase 1: Critical (Immediate - Above the fold)
function initCritical() {
  initTheme();
  initFocusMode();
  initNavbar();
  initTyping();
  initParticles();
}

// Phase 2: Deferred (Below the fold & progressive enhancements)
function initDeferred() {
  initReveal();
  initAccordion();
  initTimelineSlider();
  initCarousel();
  initNotesCarousel();
  initCeTimeline();
  initArchLayers();
  initModal();
  initForm();
  initEnhancements();
  initCursor();
}

function start() {
  initCritical();
  if ('requestIdleCallback' in window) {
    requestIdleCallback(initDeferred, { timeout: 1000 });
  } else {
    setTimeout(initDeferred, 100);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
