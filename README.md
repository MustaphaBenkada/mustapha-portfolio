# Mustapha Benkada — Portfolio

A single-page, dependency-free portfolio (plain HTML/CSS/JS — no build step) built from
Mustapha's CV.

## Preview locally

Just open `index.html` in a browser, or serve it so relative paths behave exactly like
in production:

```bash
npx serve .
# or
python3 -m http.server 8080
```

Then visit the printed local URL.

## Deploy

Any static host works, with zero configuration:

- **Netlify / Vercel**: drag-and-drop the `mustapha-portfolio` folder onto the dashboard,
  or connect the folder as a Git repo for automatic deploys.
- **GitHub Pages**: push this folder to a repo, enable Pages on the `main` branch
  (root), done.

## Customize

- Content lives directly in `index.html` (hero, about, skills, experience, highlights,
  education, contact) — edit text/links there.
- Colors, fonts, spacing and animations live in `assets/css/style.css` under the
  `:root` custom properties at the top (`--accent-1/2/3/4`, fonts, radius).
- Interaction (nav, scroll-spy, reveal animations, typewriter, cursor glow) lives in
  `assets/js/main.js`.
- Add a real photo by dropping a file into `assets/img/` and referencing it from the
  hero section in `index.html` (there's currently no photo embedded, since none could
  be extracted from the PDF).
