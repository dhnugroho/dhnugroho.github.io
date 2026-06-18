/* ============================================
   PROJECT SHOWCASE — Accordion Interaction
   Handles open/close with smooth height animation
   ============================================ */

export function initAccordion() {
  const items = document.querySelectorAll('.pj-accordion-item');
  if (!items.length) return;

  // Utility: close an item
  function closeItem(item) {
    item.classList.remove('pj-active');
    const header = item.querySelector('.pj-accordion-header');
    if (header) header.setAttribute('aria-expanded', 'false');
    const body = item.querySelector('.pj-accordion-body');
    if (body) {
      body.style.maxHeight = body.scrollHeight + 'px';
      // Force reflow before collapsing
      body.offsetHeight;
      body.style.maxHeight = '0px';
    }
  }

  // Utility: open an item
  function openItem(item) {
    item.classList.add('pj-active');
    const header = item.querySelector('.pj-accordion-header');
    if (header) header.setAttribute('aria-expanded', 'true');
    const body = item.querySelector('.pj-accordion-body');
    if (body) {
      body.style.maxHeight = body.scrollHeight + 'px';
      // After transition, remove max-height to allow natural resizing
      const onEnd = () => {
        if (item.classList.contains('pj-active')) {
          body.style.maxHeight = 'none';
        }
        body.removeEventListener('transitionend', onEnd);
      };
      body.addEventListener('transitionend', onEnd);
    }
  }

  // Toggle handler
  function toggleItem(clickedItem) {
    const isOpen = clickedItem.classList.contains('pj-active');

    // Close all
    items.forEach((item) => {
      if (item !== clickedItem && item.classList.contains('pj-active')) {
        closeItem(item);
      }
    });

    // Toggle clicked
    if (isOpen) {
      closeItem(clickedItem);
    } else {
      openItem(clickedItem);
    }
  }

  // Attach click handlers
  items.forEach((item) => {
    const header = item.querySelector('.pj-accordion-header');
    if (!header) return;

    header.addEventListener('click', () => toggleItem(item));

    // Keyboard accessibility
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleItem(item);
      }
    });
  });

  // Open first item by default
  if (items[0]) {
    items[0].classList.add('pj-active');
    const body = items[0].querySelector('.pj-accordion-body');
    if (body) {
      body.style.maxHeight = 'none';
      body.style.opacity = '1';
    }
  }

  // Update project counter
  const countEl = document.querySelector('.pj-count-num');
  if (countEl) {
    countEl.textContent = items.length;
  }
}
