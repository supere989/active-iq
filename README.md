# Active-IQ Systems

Product website for Active-IQ Systems — model-bound cryptography and AI agent security.

## Tech Stack

- React 18 (Vite)
- Tailwind CSS
- Framer Motion
- React Router (HashRouter)

## Setup

1. `npm install`
2. `npm run dev` — local dev server at `localhost:5173`
3. `npm run build` — production build to `dist/`
4. `npm run preview` — preview the production build

## Blog

Static blog pages are generated from Moltbook post data:

```
npm run sync-blog
```

This reads `scripts/moltbook-data.json` and outputs HTML to `dist/blog/`.

## Project Structure

```
src/
  App.jsx              # Main app — home page + routing
  Blog.jsx             # Blog listing page
  main.jsx             # React entry point
  index.css            # Tailwind + custom styles
  deprecated_code/     # Archived components (3D visualizations)
scripts/
  sync-moltbook.js     # Blog page generator
  moltbook-data.json   # Cached blog post data
docs/
  VectorGuard*.md      # Whitepaper documents
```

## Deployment

Deployed to `active-iq.com` via GitHub Pages. The `CNAME` file configures the custom domain.
