/* ============================================
   ARCHITECTURAL LAYERS MODULE
   Interactive SVG diagram inspection
   ============================================ */

// Mockup SVGs group their elements in <g data-layer="data|ai|ui">.
// Clicking a toolbar button records the chosen layer on the SVG as
// data-active-layer; projects.css does the dimming and highlighting.
// Because the state lives on the <svg> element, it also applies to
// content that lazyMockups.js injects after the click.
export function initArchLayers() {
  const layerButtons = document.querySelectorAll('.arch-layer-btn');
  if (!layerButtons.length) return;

  layerButtons.forEach(btn => {
    btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');

    btn.addEventListener('click', () => {
      const container = btn.closest('.pj-browser') || btn.closest('.pj-accordion-item');
      if (!container) return;

      container.querySelectorAll('.arch-layer-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const svg = container.querySelector('.pj-svg');
      if (svg) svg.setAttribute('data-active-layer', btn.getAttribute('data-layer') || 'all');
    });
  });
}
