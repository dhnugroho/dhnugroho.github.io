/* ============================================
   THEME CHOOSER MODULE
   Floating palette badge + picker panel
   ============================================ */

// ── Theme metadata ────────────────────────────────────────────────────────────
const THEMES = [
  {
    id:      'default',
    name:    'Stellar',
    desc:    'Electric Blue · Default',
    emoji:   '⚡',
    color:   '#00e5ff',
    bg:      '#0f172a',
    class:   null,
  },
  {
    id:      'green',
    name:    'Void Mint',
    desc:    'Forest Green · Dark',
    emoji:   '🌿',
    color:   '#00C896',
    bg:      '#16171B',
    class:   'green-theme',
  },
  {
    id:      'cocoa',
    name:    'Espresso',
    desc:    'Warm Cocoa · Caramel',
    emoji:   '☕',
    color:   '#D4915C',
    bg:      '#261A12',
    class:   'cocoa-theme',
  },
  {
    id:      'mocha',
    name:    'Mocha',
    desc:    'Mauve Brown · Dusty Rose',
    emoji:   '🍫',
    color:   '#C49B82',
    bg:      '#1C1620',
    class:   'mocha-theme',
  },
  {
    id:      'truffle',
    name:    'Truffle',
    desc:    'Dark Gold · Amber',
    emoji:   '✨',
    color:   '#C8A96E',
    bg:      '#1A140E',
    class:   'truffle-theme',
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
function applyTheme(themeId, { animate = true } = {}) {
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
  } catch (_) {}

  // Sync meta theme-color
  const metaColor = document.querySelector('meta[name="theme-color"]');
  if (metaColor) {
    const isLight = document.body.classList.contains('light-mode');
    metaColor.setAttribute('content', isLight ? '#ffffff' : (theme.bg || '#0a0e17'));
  }
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

  // ── Badge ──────────────────────────────────────────────────────────────
  const badge = document.createElement('button');
  badge.id = 'theme-chooser-badge';
  badge.setAttribute('aria-label', 'Open theme picker');
  badge.setAttribute('aria-expanded', 'false');
  badge.setAttribute('aria-controls', 'theme-chooser-panel');

  const swatch = document.createElement('span');
  swatch.className = 'tc-badge-swatch';

  const label = document.createElement('span');
  label.className = 'tc-badge-label';

  const chevron = document.createElement('span');
  chevron.className = 'tc-badge-chevron';
  chevron.innerHTML = `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="2,3 5,7 8,3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  badge.append(swatch, label, chevron);

  // ── Panel ──────────────────────────────────────────────────────────────
  const panel = document.createElement('div');
  panel.id = 'theme-chooser-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Choose a theme');

  const panelTitle = document.createElement('div');
  panelTitle.className = 'tc-panel-title';
  panelTitle.textContent = '🎨 Your Vibe';

  const grid = document.createElement('div');
  grid.className = 'tc-theme-grid';

  // Build one row per theme
  THEMES.forEach(theme => {
    const row = document.createElement('button');
    row.className = 'tc-theme-option';
    row.dataset.themeId = theme.id;
    row.setAttribute('aria-label', `Switch to ${theme.name} theme`);

    const dot = document.createElement('span');
    dot.className = 'tc-swatch-dot';
    dot.style.background = theme.color;
    dot.style.borderColor = theme.bg;

    const info = document.createElement('span');
    info.className = 'tc-swatch-info';

    const name = document.createElement('span');
    name.className = 'tc-swatch-name';
    name.textContent = `${theme.emoji} ${theme.name}`;

    const desc = document.createElement('span');
    desc.className = 'tc-swatch-desc';
    desc.textContent = theme.desc;

    info.append(name, desc);
    row.append(dot, info);
    grid.appendChild(row);
  });

  // Surprise Me button
  const surpriseBtn = document.createElement('button');
  surpriseBtn.className = 'tc-surprise-btn';
  surpriseBtn.innerHTML = `<span class="tc-dice-icon">🎲</span> Surprise Me`;

  panel.append(panelTitle, grid, surpriseBtn);

  document.body.append(badge, panel);

  return { badge, panel, swatch, label, grid, surpriseBtn };
}

// ── Sync badge visual with current theme ────────────────────────────────────
function syncBadge(theme, swatch, label) {
  swatch.style.background = theme.color;
  swatch.style.boxShadow  = `0 0 8px ${theme.color}60`;
  label.textContent = theme.name;
}

// ── Sync panel active state ──────────────────────────────────────────────────
function syncPanel(themeId, grid) {
  grid.querySelectorAll('.tc-theme-option').forEach(row => {
    row.classList.toggle('active', row.dataset.themeId === themeId);
  });
}

// ── Main init ─────────────────────────────────────────────────────────────────
export function initThemeChooser() {
  const { badge, panel, swatch, label, grid, surpriseBtn } = buildChooserUI();

  let isOpen = false;

  // Sync initial state — user's pick overrides randomised session variant
  let initialTheme = getActiveTheme();
  try {
    const picked = localStorage.getItem(STORAGE_KEY);
    if (picked) {
      // Re-apply the user's saved preference (overrides the random session pick)
      applyTheme(picked, { animate: false });
      initialTheme = THEMES.find(t => t.id === picked) || initialTheme;
    }
  } catch (_) {}

  syncBadge(initialTheme, swatch, label);
  syncPanel(initialTheme.id, grid);

  // ── Toggle panel ──────────────────────────────────────────────────────
  function openPanel() {
    isOpen = true;
    panel.classList.add('open');
    badge.classList.add('open');
    badge.setAttribute('aria-expanded', 'true');
  }

  function closePanel() {
    isOpen = false;
    panel.classList.remove('open');
    badge.classList.remove('open');
    badge.setAttribute('aria-expanded', 'false');
  }

  badge.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen ? closePanel() : openPanel();
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (isOpen && !panel.contains(e.target) && !badge.contains(e.target)) {
      closePanel();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (isOpen && e.key === 'Escape') {
      closePanel();
      badge.focus();
    }
  });

  // ── Theme swatch click ────────────────────────────────────────────────
  grid.addEventListener('click', (e) => {
    const row = e.target.closest('.tc-theme-option');
    if (!row) return;
    const themeId = row.dataset.themeId;
    applyTheme(themeId);
    const picked = THEMES.find(t => t.id === themeId) || THEMES[0];
    syncBadge(picked, swatch, label);
    syncPanel(themeId, grid);
    // Brief delay before closing so the active state is visible
    setTimeout(closePanel, 300);
  });

  // ── Surprise Me ──────────────────────────────────────────────────────
  surpriseBtn.addEventListener('click', () => {
    const current = getActiveTheme();
    const next    = pickSurpriseTheme(current.id);
    applyTheme(next.id);
    syncBadge(next, swatch, label);
    syncPanel(next.id, grid);
    setTimeout(closePanel, 350);
  });

  // ── Re-sync badge if light/dark toggle changes ─────────────────────────
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      requestAnimationFrame(() => {
        const current = getActiveTheme();
        syncBadge(current, swatch, label);
      });
    });
  }
}
