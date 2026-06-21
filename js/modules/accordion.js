/* ============================================
   PROJECT SHOWCASE — Accordion Interaction
   Handles open/close with smooth height animation
   ============================================ */

export function initAccordion() {
  const container = document.querySelector('.pj-accordion');
  if (!container) return;

  // 1. Convert to Array and sort by date descending
  let items = Array.from(container.querySelectorAll('.pj-accordion-item'));
  if (!items.length) return;

  items.sort((a, b) => {
    const dateA = a.getAttribute('data-date') || '1970-01-01';
    const dateB = b.getAttribute('data-date') || '1970-01-01';
    return new Date(dateB) - new Date(dateA);
  });

  // 2. Re-append sorted elements and update their displayed index numbers
  items.forEach((item, index) => {
    container.appendChild(item);

    // Update index display (padded to 2 digits, e.g., "01", "02")
    const indexEl = item.querySelector('.pj-index');
    if (indexEl) {
      indexEl.textContent = String(index + 1).padStart(2, '0');
    }

    // Set first item active, collapse the rest
    const header = item.querySelector('.pj-accordion-header');
    const body = item.querySelector('.pj-accordion-body');
    if (index === 0) {
      item.classList.add('pj-active');
      if (header) header.setAttribute('aria-expanded', 'true');
      if (body) {
        body.style.maxHeight = 'none';
      }
    } else {
      item.classList.remove('pj-active');
      if (header) header.setAttribute('aria-expanded', 'false');
      if (body) {
        body.style.maxHeight = '0px';
      }
    }
  });

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

  // Update project counter
  const countEl = document.querySelector('.pj-count-num');
  if (countEl) {
    countEl.textContent = items.length;
  }
}
