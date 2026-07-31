/* ============================================
   FOCUS SHIELD MODULE — Quick Scan vs Deep Architect

   Neuroscience principles applied:
   - Persistence (localStorage) — spatial memory across sessions
   - 140 ms content fade — anticipation window before state change
   - Click ripple — confirms the interaction had an effect
   - 1.2 s confirmation text — provides closure, no "did it work?" anxiety
   - ARIA aria-pressed — screen-reader parity
   - prefers-reduced-motion guard — respects vestibular needs
   ============================================ */

const STORAGE_KEY      = 'dhn-view-mode';
const FADE_DURATION = 140; // ms — below threshold for feeling "slow"

export function initFocusMode() {
  const btnScan    = document.getElementById('focusScanBtn');
  const btnArch    = document.getElementById('focusArchBtn');
  const toggleWrap = document.querySelector('.focus-toggle-wrap');
  const hintScan   = document.querySelector('.focus-hint-scan');
  const hintArch   = document.querySelector('.focus-hint-arch');

  if (!btnScan || !btnArch || !toggleWrap) return;

  // Respect OS-level motion preference throughout
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Ripple: spawned at exact click position ──────────────────────
  // Closes the "did it register?" loop without a modal or toast.
  function spawnRipple(btn, e) {
    if (prefersReduced) return;
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    const x      = e.clientX - rect.left  - size / 2;
    const y      = e.clientY - rect.top   - size / 2;
    const ripple = document.createElement('span');
    ripple.className = 'focus-ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  }

  // ── Phase 1: Controls — update synchronously on every click ─────
  // Pill, aria-pressed, active class, and hint text all update
  // IMMEDIATELY so the guard works and the visual pill never lags.
  function _applyControlsDOM(mode) {
    const isScan = mode === 'scan';
    toggleWrap.dataset.mode = mode;
    btnScan.setAttribute('aria-pressed', isScan ? 'true' : 'false');
    btnArch.setAttribute('aria-pressed', isScan ? 'false' : 'true');
    btnScan.classList.toggle('active', isScan);
    btnArch.classList.toggle('active', !isScan);
    if (hintScan) hintScan.hidden = !isScan;
    if (hintArch) hintArch.hidden = isScan;
  }

  // ── Phase 2: Content — the DOM-heavy work done after the fade ───
  function _applyContentDOM(mode) {
    const isScan = mode === 'scan';
    document.body.classList.toggle('mode-quick-scan', isScan);
    document.body.classList.toggle('mode-deep-architect', !isScan);
    if (isScan) {
      document.querySelectorAll('.pj-accordion-item').forEach(item => {
        item.classList.remove('pj-active', 'expanded');
        const body = item.querySelector('.pj-accordion-body');
        if (body) body.style.maxHeight = null;
      });
    } else {
      // Deep Architect mode: default open project 01 if no item is currently active
      const items = Array.from(document.querySelectorAll('.pj-accordion-item'));
      const hasActive = items.some(item => item.classList.contains('pj-active') || item.classList.contains('expanded'));
      if (!hasActive && items.length > 0) {
        const first = items[0];
        first.classList.add('pj-active', 'expanded');
        const header = first.querySelector('.pj-accordion-header');
        if (header) header.setAttribute('aria-expanded', 'true');
        const body = first.querySelector('.pj-accordion-body');
        const inner = first.querySelector('.inner-content') || first.querySelector('.pj-accordion-inner');
        if (inner) inner.classList.add('active');
        if (body) {
          body.classList.add('active');
          body.style.maxHeight = 'none';
        }
      }
    }
  }

  // ── Transition wrapper ───────────────────────────────────────────
  // One cancelable timeout at a time.
  // If a new click arrives mid-fade, clearTimeout kills the old pending
  // content swap, resets main styles, and queues a fresh one — so
  // timeouts never stack and transitionend listeners never accumulate.
  let pendingTimeout = null;
  const main = document.querySelector('main');

  function _resetMainStyles() {
    if (!main) return;
    main.style.transition    = '';
    main.style.opacity       = '';
    main.style.pointerEvents = '';
  }

  function applyMode(mode, withTransition) {
    try { localStorage.setItem(STORAGE_KEY, mode); } catch (_) {}

    // Phase 1: always immediate
    _applyControlsDOM(mode);

    // Cancel any in-flight content swap
    clearTimeout(pendingTimeout);

    if (withTransition && !prefersReduced && main) {
      // Start or restart the fade — main may already be at 0.88 if
      // a previous click was interrupted; that's fine, we just reset
      // the timeout and let the same dip finish naturally.
      main.style.transition    = `opacity ${FADE_DURATION}ms ease`;
      main.style.opacity       = '0.88';
      main.style.pointerEvents = 'none';

      pendingTimeout = setTimeout(() => {
        pendingTimeout = null;
        _applyContentDOM(mode);
        main.style.opacity       = '1';
        main.style.pointerEvents = '';
        // One-shot cleanup after the fade-back completes
        main.addEventListener('transitionend', _resetMainStyles, { once: true });
        // Safety net: clear inline styles even if transitionend never fires
        // (e.g. tab hidden, display:none, or zero-duration CSS override)
        setTimeout(_resetMainStyles, FADE_DURATION + 80);
      }, FADE_DURATION);
    } else {
      // No transition: apply content immediately and ensure main is clean
      _applyContentDOM(mode);
      _resetMainStyles();
    }
  }

  // ── Init: restore saved mode, default to Quick Scan ─────────────
  let savedMode = 'scan';
  try { savedMode = localStorage.getItem(STORAGE_KEY) || 'scan'; } catch (_) {}
  applyMode(savedMode, false);

  // ── Click handlers ───────────────────────────────────────────────
  // Guard now checks toggleWrap.dataset.mode — the single source of
  // truth for pill position, updated synchronously in Phase 1.
  btnScan.addEventListener('click', (e) => {
    if (toggleWrap.dataset.mode === 'scan') return;
    spawnRipple(btnScan, e);
    applyMode('scan', true);
  });

  btnArch.addEventListener('click', (e) => {
    if (toggleWrap.dataset.mode === 'architect') return;
    spawnRipple(btnArch, e);
    applyMode('architect', true);
  });

  initAmbientMode();
  initSmartCTA();
}

function initAmbientMode() {
  const ambientBtn = document.getElementById('ambientToggleBtn');
  if (!ambientBtn) return;

  ambientBtn.addEventListener('click', () => {
    const isActive = document.body.classList.toggle('mode-ambient');
    ambientBtn.classList.toggle('active', isActive);
    ambientBtn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function initSmartCTA() {
  document.querySelectorAll('.smart-cta-action').forEach(btn => {
    btn.addEventListener('click', () => {
      const topic   = btn.getAttribute('data-topic') || 'Project Collaboration';
      const email   = 'dhnugroho.dev@gmail.com';
      const subject = encodeURIComponent(`Discussion: ${topic}`);
      const body    = encodeURIComponent(
        `Hi Dhani,\n\nI was reviewing your portfolio and would love to discuss ${topic}.\n\nBest regards,`
      );
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    });
  });
}
