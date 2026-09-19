# Note Styling & Theme Rules

These rules apply whenever modifying, reviewing, or adding notes in `index.html`.

## 1. Typography & Hierarchy
- **Headings**: `var(--font-heading)` (`Space Grotesk`), weight 700. Never use serif or thin 300 weights.
- **Prose**: `var(--font-body)` (`Inter`), size >= 0.94rem (~15px), line-height 1.75–1.82, color `var(--text-primary)`.
- **Badges/Telemetry**: `var(--font-mono)` (`JetBrains Mono`), size 0.70rem–0.78rem, weight 600–700, letter-spacing 0.08em–0.12em uppercase. Never sub-10px.

## 2. Color Restraint & Variable Binding
- All backgrounds, borders, and text colors MUST use CSS custom properties:
  - Containers: `var(--bg-surface-solid)` or `var(--bg-card)` with `1px solid var(--border-subtle)`
  - Headings: `var(--text-bright)`
  - Prose: `var(--text-primary)`
  - Meta/Subheaders: `var(--text-muted)`
  - Accent Badges: `color: var(--accent-primary)`, `background: var(--accent-primary-dim)`, `border: 1px solid var(--border-subtle)`
- **No Rainbow Styling**: Do not mix arbitrary ad-hoc colors across cards and tags. Keep the palette disciplined to the active theme's tokens.

## 3. Interactive Signal Isolation
- Interactive telemetry colors (e.g. dynamic canvas waveforms, live pulse meters, status indicators) are strictly reserved for the interactive visualization element itself.
- Never bleed interactive signal colors into note prose, regular badges, or structural card backgrounds.

## 4. Theme & Mode Adaptation
- Must look high-contrast, comfortable, and elegant in both Dark Mode (`body`) and Light Mode (`body.light-mode`) across all 6 themes (Stellar, Void Mint, Espresso, Mocha, Truffle, Maroon).
- Canvases must check `document.body.classList.contains('light-mode')` to adjust clearing alpha and grid contrast.

## 5. Integrity
- UTF-8 clean only. No mojibake (`â€”`, `â†’`, etc.).
- Always verify isolated changes with `git diff`.
