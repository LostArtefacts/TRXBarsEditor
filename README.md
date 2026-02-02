# Bars Editor

Tiny browser app to edit `ui.json5` bar palettes.

## Use

This repo currently contains:

- The original vanilla JS app in `static/`
- A React/Vite rewrite in `src/` that builds to `static/`

### React app (recommended)

Dev server:

1. `npm install`
2. `npm run dev`

Build static output:

1. `npm run build`
2. Open or host `static/index.html`

### Original app

1. Open `static/index.html` in your browser.
2. Click **Upload…** (or drag/drop) and pick `ui.json5`.
3. Click a bar, tweak colors, then **Save** (or **Reset**).

## Notes

- Your last uploaded file is remembered across refreshes.
- If the file doesn’t parse, you’ll get an error and can upload again.
