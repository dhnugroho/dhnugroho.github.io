# dhnugroho.github.io

> No frameworks. Back to basics: just developing ideas and utilizing AI.

Personal portfolio of **Dhani Nugroho**, Full-stack Engineer & Data Architect based in Jakarta, Indonesia.

🌐 **Live:** https://dhnugroho.github.io

## Highlights

- **Pure vanilla stack:** HTML, CSS, and JavaScript with no frontend framework.
- **Single-page layout** with Portfolio, Projects, Experience, Skills, Notes, About, and Contact sections.
- **Interactive themes:** theme chooser, focus mode, particles, a custom cursor, and typing/reveal animations.
- **Portfolio assistant:** a rule-based chatbot (`chatbot.js`) backed by a static knowledge base. It needs no API calls and no dependencies.

## Project Structure

```
.
├── index.html            # The whole site (single page)
├── chatbot.js            # Portfolio assistant (source)
├── css/
│   ├── main.css          # Entry point that imports everything below
│   ├── base/             # Reset, variables, typography
│   ├── layout/           # Layout and footer
│   ├── utilities/        # Theme, cursor, helpers
│   └── components/       # One file per UI component
├── js/
│   ├── early-init.js     # Runs in <head>: theme + fonts before first paint
│   ├── main.js           # Entry point that imports all modules
│   └── modules/          # Theme, navbar, carousel, notes, focus mode, etc.
├── img/
│   ├── portfolio/        # Optimized WebP images used by the page
│   ├── mockups/          # Project mockup SVGs, lazy-loaded inline
│   └── _src/             # Full-size originals (not deployed)
├── _config.yml           # GitHub Pages settings (excludes dev files)
├── package.json          # npm scripts & dev dependencies
├── minify.js             # Build script (esbuild)
├── optimize-images.js    # Image optimization script (sharp)
├── serve.cjs             # Zero-dependency local dev server
└── .agents/              # Styling rules & skills for AI coding agents
```

## Running Locally

Requires [Node.js](https://nodejs.org/) 18 or newer. The dev server has no dependencies:

```bash
npm start
```

Then open http://localhost:3000. A custom port works too: `PORT=8080 npm start`. If the port is busy, the server tries the next one.

## Building

`index.html` loads the **minified** files (`css/main.min.css`, `css/notes.min.css`, `js/main.min.js`, `chatbot.min.js`), so rebuild them after editing any source file:

```bash
npm install
```

```bash
npm run build
```

| Source                     | Output              |
| -------------------------- | ------------------- |
| `css/main.css` (bundled)   | `css/main.min.css`  |
| `css/components/notes.css` | `css/notes.min.css` |
| `js/main.js` (bundled)     | `js/main.min.js`    |
| `chatbot.js`               | `chatbot.min.js`    |

After rebuilding, bump the cache-busting version in `index.html` (for example `main.min.js?v=2.8` → `?v=2.9`) so visitors get the new files.

### Optimizing Images

Reads the originals in `img/_src/portfolio/` and writes WebP versions (full size and thumbnails) to `img/portfolio/`:

```bash
npm run optimize-images
```

## Deployment

The site is served by **GitHub Pages** straight from the `master` branch. Commit the rebuilt minified files and push, with no CI step needed.

GitHub Pages runs the repo through Jekyll, which copies `index.html` as-is (it has no front matter). Folders starting with `_` or `.` are skipped, and `_config.yml` excludes the development files, so neither the image originals nor the build tooling are published.

## Contributing Notes (AI Agents)

`.agents/rules/note-styling-rules.md` and `.agents/skills/note-theme-styling/` define the styling rules for the Notes section: fonts, theme tokens, and a restrained color palette. AI coding agents should follow them when editing notes.

## License

[MIT](LICENSE) © 2018–2026 Dhani Nugroho. The copyright notice from the original template (Blackrock Digital LLC, 2013–2017) is retained.
