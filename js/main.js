import { initParticles } from './modules/particles.js';
import { initTyping } from './modules/typing.js';
import { initCursor } from './modules/cursor.js';
import { initNavbar } from './modules/navbar.js';
import { initReveal } from './modules/reveal.js';
import { initModal } from './modules/modal.js';
import { initForm } from './modules/form.js';
import { initLang } from './modules/lang.js';
import { initTheme } from './modules/theme.js';
import { initCarousel } from './modules/carousel.js';
import { initCeTimeline } from './modules/ceTimeline.js';
import { initAccordion } from './modules/accordion.js';

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initTyping();
  initCursor();
  initNavbar();
  initReveal();
  initModal();
  initForm();
  initLang();
  initTheme();
  initCarousel();
  initCeTimeline();
  initAccordion();
});
