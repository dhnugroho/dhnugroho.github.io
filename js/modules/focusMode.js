/* ============================================
   FOCUS SHIELD MODULE — Quick Scan vs Deep Architect
   ============================================ */

export function initFocusMode() {
  const btnScan = document.getElementById('focusScanBtn');
  const btnArchitect = document.getElementById('focusArchBtn');
  
  if (!btnScan || !btnArchitect) return;

  function applyMode(mode) {
    if (mode === 'scan') {
      document.body.classList.add('mode-quick-scan');
      btnScan.classList.add('active');
      btnArchitect.classList.remove('active');

      // Close all project accordions for skimmable list view
      document.querySelectorAll('.pj-accordion-item').forEach(item => {
        item.classList.remove('pj-active');
        const body = item.querySelector('.pj-accordion-body');
        if (body) body.style.maxHeight = null;
      });
    } else {
      document.body.classList.remove('mode-quick-scan');
      btnArchitect.classList.add('active');
      btnScan.classList.remove('active');
    }
  }

  // Always start in Deep Architect Mode by default when opening the website
  applyMode('architect');

  btnScan.addEventListener('click', () => applyMode('scan'));
  btnArchitect.addEventListener('click', () => applyMode('architect'));

  initAmbientMode();
  initSmartCTA();
}

function initAmbientMode() {
  const ambientBtn = document.getElementById('ambientToggleBtn');
  if (!ambientBtn) return;

  ambientBtn.addEventListener('click', () => {
    const isActive = document.body.classList.toggle('mode-ambient');
    if (isActive) {
      ambientBtn.classList.add('active');
    } else {
      ambientBtn.classList.remove('active');
    }
  });
}

function initSmartCTA() {
  const smartBtns = document.querySelectorAll('.smart-cta-action');
  smartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const topic = btn.getAttribute('data-topic') || 'Project Collaboration';
      const email = 'dhnugroho.dev@gmail.com';
      const subject = encodeURIComponent(`Discussion: ${topic}`);
      const body = encodeURIComponent(`Hi Dhani,\n\nI was reviewing your portfolio and would love to discuss ${topic}.\n\nBest regards,`);
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    });
  });
}

