/* ============================================
   ARCHITECTURAL LAYERS MODULE
   Interactive SVG diagram inspection
   ============================================ */

export function initArchLayers() {
  const layerButtons = document.querySelectorAll('.arch-layer-btn');
  if (!layerButtons.length) return;

  layerButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const container = btn.closest('.pj-browser') || btn.closest('.pj-accordion-item');
      if (!container) return;

      // Reset active state for buttons in this container
      const containerBtns = container.querySelectorAll('.arch-layer-btn');
      containerBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetLayer = btn.getAttribute('data-layer');
      const svg = container.querySelector('.pj-svg');
      if (!svg) return;

      // Find SVG elements with data-layer or layer classes
      const allLayerElements = svg.querySelectorAll('[data-layer], g, rect, path, circle');

      if (targetLayer === 'all') {
        allLayerElements.forEach(el => {
          el.style.opacity = '';
          el.style.filter = '';
        });
      } else {
        allLayerElements.forEach(el => {
          const elLayer = el.getAttribute('data-layer') || el.classList.value;
          if (elLayer && elLayer.includes(targetLayer)) {
            el.style.opacity = '1';
            el.style.filter = 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.8))';
          } else if (el.tagName !== 'svg' && el.parentElement && el.parentElement.tagName !== 'svg') {
            el.style.opacity = '0.25';
            el.style.filter = 'none';
          }
        });
      }
    });
  });
}
