---
name: note-theme-styling
description: Design system guidelines, typography hierarchy, font sizing, color discipline, and Dark/Light mode theme adaptation for engineering portfolio notes. Use whenever designing, refactoring, or reviewing notes in index.html.
---

# Note Theme, Typography & Color Styling System

This skill defines the strict visual, typographic, and theme-binding rules for all notes (Note 1 through Note 9+) in the portfolio.

## Core Philosophy
1. **Engineering Precision & Legibility First**: Text must be immediately legible, eye-catching, and comfortable to read across all screen sizes and themes.
2. **Color Discipline (No Rainbow Clutter)**: Do not scatter arbitrary ad-hoc hex colors across cards, badges, and prose. All styling must bind to the site's semantic CSS custom properties.
3. **Interactive Signal Isolation**: Vivid, dynamic colors (e.g., ECG waveforms, pulse meters, telemetry signals) are reserved strictly for interactive visual displays and never bleed into structural text or card containers.
4. **Seamless Dark & Light Mode Adaptation**: Every note must look native and stunning in both Dark Mode and Light Mode across all 6 themes (Stellar, Void Mint, Espresso, Mocha, Truffle, Maroon).

---

## 1. Typography Hierarchy & Font Scaling

Never use fallback serif fonts (e.g. `Literata`, `Georgia`, or thin 300 weights). Always use the portfolio's loaded font families:

| Hierarchy Level | Font Family | Size Range | Weight | Line Height | Usage |
|---|---|---|---|---|---|
| **Note Title & Main Heading** | `var(--font-heading)` (`'Space Grotesk', -apple-system, sans-serif`) | `clamp(1.35rem, 3vw, 1.85rem)` | `700` | `1.25 – 1.3` | Primary note titles, section openers |
| **Section Subheading / Card Title** | `var(--font-heading)` | `1.05rem – 1.25rem` | `600 – 700` | `1.3 – 1.4` | Question cards, quadrant titles, breakdown headers |
| **Intro Callout / Lead Prose** | `var(--font-heading)` or `var(--font-body)` | `1.0rem – 1.12rem` | `500 – 600` | `1.6 – 1.7` | Opening italicized reflection or thesis statement |
| **Standard Prose & Descriptions** | `var(--font-body)` (`'Inter', -apple-system, sans-serif`) | `0.94rem – 0.98rem` (~15px–15.7px) | `400` (bold `600`) | `1.75 – 1.82` | Core narrative, explanations, quote explanations |
| **Telemetry, Badges, Metadata, Tags** | `var(--font-mono)` (`'JetBrains Mono', monospace`) | `0.70rem – 0.78rem` (~11.5px–12.5px) | `600 – 700` | `1.3 – 1.4` | Subheaders, step numbers, timestamps, status badges |

### Typography Rules
- **No micro-text**: Never use font sizes below `0.70rem` (`11.2px`).
- **Comfortable Line Height**: Body text must maintain `1.75` to `1.82` line-height for effortless reading.
- **Letter Spacing**: Use `letter-spacing: 0.08em` to `0.12em` with `text-transform: uppercase` for monospace labels and badges.
- **Emphasis**: Use `font-style: italic; color: var(--accent-primary);` for stressed keywords in titles or subtitles.

---

## 2. Color Palette & Semantic Variable Binding

Every note element must utilize the design system's CSS custom properties:

```css
/* Card Backgrounds and Borders */
background: var(--bg-surface-solid); /* or var(--bg-card) */
border: 1px solid var(--border-subtle);
border-radius: 12px;

/* Hover states */
border-color: var(--border-glow);
background: var(--bg-card-hover);

/* Text Hierarchy */
--text-bright   /* High-contrast headings, main titles, emphasis numbers */
--text-primary  /* Core body paragraphs, answers, descriptive prose */
--text-muted    /* Metadata, dates, subheadings, labels, footnotes */

/* Accents and Tags */
color: var(--accent-primary);
background: var(--accent-primary-dim);
border: 1px solid var(--border-subtle);
```

### Color Discipline Rules
- **Avoid Rainbow Syndrome**: Do not assign disparate colors (e.g. amber for badge 1, purple for badge 2, pink for badge 3, cyan for badge 4). Keep all badges and card accents anchored to `var(--accent-primary)` and `var(--accent-primary-dim)`.
- **Contrast Ratios**: In both dark and light modes, `var(--text-primary)` and `var(--text-bright)` guarantee WCAG AAA compliance against `var(--bg-surface-solid)` and `var(--bg-card)`.
- **Surface Elevation**: Use `backdrop-filter: blur(12px)` with `var(--bg-card)` for glassmorphism, paired with `1px solid var(--border-subtle)`.

---

## 3. Interactive Signal & Telemetry Isolation

Dynamic visualizations (ECG monitor, live audio visualizer, charts, interactive state buttons) have specialized rules:

1. **Strict Isolation**: Vibrant signal colors (e.g., `#2dd4bf` teal for "ALIVE / STABLE", `#fb7185` rose for "FLATLINE / CRITICAL") are strictly reserved for:
   - The canvas waveform / data trace
   - Live telemetry readouts (e.g., BPM counter, live frequency value)
   - Status indicators (e.g., pulsing status dot)
2. **Never Bleed**: These colors must NEVER be applied to the enclosing note's narrative prose, regular section headers, or general-purpose badges.
3. **Canvas Theme Awareness**:
   Canvas animations must dynamically detect Dark Mode vs. Light Mode:
   ```javascript
   const isLight = document.body.classList.contains('light-mode');
   // Adjust clearRect / background wash and grid line opacity accordingly:
   ctx.fillStyle = isLight ? 'rgba(248, 250, 252, 0.28)' : 'rgba(8, 12, 20, 0.28)';
   gridColor = isLight ? 'rgba(15, 23, 42, 0.06)' : 'rgba(255, 255, 255, 0.05)';
   ```

---

## 4. Dark vs. Light Mode Contrast Specs

| Element | Dark Mode (`body`) | Light Mode (`body.light-mode`) |
|---|---|---|
| Note Background | Deep obsidian / navy (`var(--bg-base)`) | Soft paper / off-white (`#f8fafc`) |
| Card Containers | Semi-opaque dark glass (`var(--bg-card)`) | Clean white frosted glass (`#ffffff`) |
| Heading Text | Crisp pure white (`var(--text-bright)`) | Deep slate / charcoal (`#0f172a`) |
| Body Text | High-contrast cool silver (`var(--text-primary)`) | Readable dark charcoal (`#334155`) |
| Muted Labels | Slate gray (`var(--text-muted)`) | Subtle medium slate (`#64748b`) |
| Accent Highlights | Glowing themed tint (`var(--accent-primary)`) | Saturated themed tint (`var(--accent-primary)`) |

---

## 5. Verification Checklist Before Committing Changes to Notes
- [ ] Are all font families mapped to `var(--font-heading)`, `var(--font-body)`, or `var(--font-mono)`?
- [ ] Is body font size >= 15px (`0.94rem`) with line-height >= 1.75?
- [ ] Are all backgrounds, text colors, and borders referencing CSS custom properties rather than hardcoded `#hex` or `rgba` values?
- [ ] Is color restraint maintained (no uncoordinated multi-color rainbow badges)?
- [ ] Are interactive telemetry colors confined strictly to the interactive canvas/meter?
- [ ] Does the note render with high contrast and eye comfort in both Dark Mode and Light Mode across all 6 themes?
- [ ] Is the document encoding clean (UTF-8, zero mojibake characters)?
- [ ] Does `git diff` confirm strictly isolated edits without touching unrelated notes?
