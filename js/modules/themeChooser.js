/* ============================================
   THEME CHOOSER MODULE
   Floating palette badge + picker panel
   ============================================ */

// ── Theme metadata ────────────────────────────────────────────────────────────
const THEMES = [
  {
    id: 'default',
    name: 'Stellar',
    desc: 'Electric Blue · Default',
    emoji: '⚡',
    color: '#00e5ff',
    bg: '#0f172a',
    class: null,
  },
  {
    id: 'green',
    name: 'Void Mint',
    desc: 'Forest Green · Dark',
    emoji: '🌿',
    color: '#00C896',
    bg: '#16171B',
    class: 'green-theme',
  },
  {
    id: 'cocoa',
    name: 'Espresso',
    desc: 'Warm Cocoa · Caramel',
    emoji: '☕',
    color: '#D4915C',
    bg: '#261A12',
    class: 'cocoa-theme',
  },
  {
    id: 'mocha',
    name: 'Mocha',
    desc: 'Mauve Brown · Dusty Rose',
    emoji: '🍫',
    color: '#C49B82',
    bg: '#1C1620',
    class: 'mocha-theme',
  },
  {
    id: 'truffle',
    name: 'Truffle',
    desc: 'Dark Gold · Amber',
    emoji: '✨',
    color: '#C8A96E',
    bg: '#1A140E',
    class: 'truffle-theme',
  },
  {
    id: 'maroon',
    name: 'Crimson Ruby',
    desc: 'Crimson Ruby · Maroon',
    emoji: '🍷',
    color: '#800000',
    bg: '#2B2A28',
    class: 'maroon-theme',
  },
];

const ALL_THEME_CLASSES = THEMES.filter(t => t.class).map(t => t.class);
const STORAGE_KEY = 'userPickedColorTheme';

// ── Read active theme ─────────────────────────────────────────────────────────
function getActiveTheme() {
  for (const t of THEMES) {
    if (t.class && document.body.classList.contains(t.class)) return t;
  }
  return THEMES[0]; // default
}

// ── Apply a theme ────────────────────────────────────────────────────────────
function applyTheme(themeId, options) {
  const animate = options && options.animate !== undefined ? options.animate : true;
  const theme = THEMES.find(t => t.id === themeId);
  if (!theme) return;

  // Flash overlay
  if (animate) {
    const flash = document.querySelector('.tc-transition-flash');
    if (flash) {
      flash.classList.add('flash');
      setTimeout(() => flash.classList.remove('flash'), 200);
    }
  }

  // Swap body class
  document.body.classList.remove(...ALL_THEME_CLASSES);
  if (theme.class) {
    document.body.classList.add(theme.class);
  }

  // Persist user's explicit pick
  try {
    localStorage.setItem(STORAGE_KEY, themeId);
    // Also sync the variant keys used by the random picker so next page load respects it
    sessionStorage.setItem('chosenColorThemeVariant', themeId);
    localStorage.setItem('lastColorThemeVariant', themeId);
  } catch (_) { }

  // Sync meta theme-color
  const metaColor = document.querySelector('meta[name="theme-color"]');
  if (metaColor) {
    const isLight = document.body.classList.contains('light-mode');
    metaColor.setAttribute('content', isLight ? '#ffffff' : (theme.bg || '#0a0e17'));
  }

  // Dispatch event for hero background and other reactive components
  try {
    window.dispatchEvent(new CustomEvent('themechange', { detail: { themeId, theme } }));
  } catch (_) { }
}

// ── Pick a random theme (excluding current) ──────────────────────────────────
function pickSurpriseTheme(currentId) {
  const pool = THEMES.filter(t => t.id !== currentId);
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── Build DOM ────────────────────────────────────────────────────────────────
function buildChooserUI() {
  // Flash overlay (for transitions)
  const flash = document.createElement('div');
  flash.className = 'tc-transition-flash';
  document.body.appendChild(flash);

  // ── Direct Action Button — Circular Spinning Die FAB ───────────────────────
  const badge = document.createElement('button');
  badge.id = 'theme-chooser-badge';
  badge.setAttribute('aria-label', 'Surprise theme: roll a random color theme');
  badge.setAttribute('title', 'Surprise Theme');

  // Spinning die SVG icon matching stroke/size style of themeToggleBtn
  const dieIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  dieIcon.setAttribute('class', 'tc-badge-die-icon');
  dieIcon.setAttribute('width', '24');
  dieIcon.setAttribute('height', '24');
  dieIcon.setAttribute('viewBox', '0 0 24 24');
  dieIcon.setAttribute('fill', 'none');
  dieIcon.setAttribute('stroke', 'currentColor');
  dieIcon.setAttribute('stroke-width', '2');
  dieIcon.setAttribute('stroke-linecap', 'round');
  dieIcon.setAttribute('stroke-linejoin', 'round');
  dieIcon.innerHTML = `
    <rect x="3" y="3" width="18" height="18" rx="4" ry="4"/>
    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="8.5" cy="15.5" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="15.5" cy="15.5" r="1.5" fill="currentColor" stroke="none"/>
  `;

  // Tooltip label on hover
  const tooltip = document.createElement('span');
  tooltip.className = 'tc-badge-tooltip';
  tooltip.textContent = 'Surprise Theme';

  badge.append(dieIcon, tooltip);
  document.body.append(badge);

  return { badge, dieIcon, tooltip };
}

// ── Sync badge visual with current theme ────────────────────────────────────
function syncBadge(theme, tooltip, badge, justRolled = false) {
  if (tooltip && theme) {
    tooltip.textContent = justRolled ? `🎲 ${theme.name}!` : `Surprise Theme: ${theme.name}`;
  }
  if (badge && theme) {
    badge.setAttribute('aria-label', `Surprise theme: roll a random color theme (Current: ${theme.name})`);
    badge.setAttribute('title', `Surprise Theme: ${theme.name}`);
  }
}

// ── Main init ─────────────────────────────────────────────────────────────────
export function initThemeChooser() {
  const ui = buildChooserUI();
  const badge = ui.badge;
  const dieIcon = ui.dieIcon;
  const tooltip = ui.tooltip;

  // Sync initial state — user's pick overrides randomised session variant
  let initialTheme = getActiveTheme();
  try {
    const picked = localStorage.getItem(STORAGE_KEY);
    if (picked) {
      // Re-apply the user's saved preference (overrides the random session pick)
      applyTheme(picked, { animate: false });
      initialTheme = THEMES.find(t => t.id === picked) || initialTheme;
    }
  } catch (_) { }

  syncBadge(initialTheme, tooltip, badge, false);

  let isRolling = false;

  // ── Direct Roll on Click ───────────────────────────────────────────────
  badge.addEventListener('click', () => {
    if (isRolling) return;
    isRolling = true;

    // Trigger fast 3D roll spin
    dieIcon.classList.remove('rolling');
    void dieIcon.offsetWidth; // force DOM reflow
    dieIcon.classList.add('rolling');

    const current = getActiveTheme();
    const next = pickSurpriseTheme(current.id);
    applyTheme(next.id);
    syncBadge(next, tooltip, badge, true);

    setTimeout(() => {
      dieIcon.classList.remove('rolling');
      isRolling = false;
      syncBadge(next, tooltip, badge, false);
    }, 800);
  });

  // ── Re-sync badge if light/dark toggle changes ─────────────────────────
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      requestAnimationFrame(() => {
        const current = getActiveTheme();
        syncBadge(current, tooltip, badge, false);
      });
    });
  }
}
