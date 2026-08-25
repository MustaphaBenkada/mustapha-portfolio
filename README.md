# Mustapha Benkada — Portfolio

A single-page, dependency-free portfolio (plain HTML/CSS/JS — no build step).

## Preview locally

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Deploy to GitHub Pages

### 1. Log in (one time)

```bash
gh auth login
```

Choose GitHub.com → HTTPS → Login with a web browser.

### 2. Create the repo and push

From this folder:

```bash
gh repo create mustapha-portfolio --public --source=. --remote=origin --push
```

### 3. Enable GitHub Pages

```bash
gh api repos/{owner}/{repo}/pages -X POST -f build_type=legacy -f source[branch]=main -f source[path]=/
```

Or in the browser: **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)` → Save**.

Your site will be live at:

`https://<your-github-username>.github.io/mustapha-portfolio/`

(It can take 1–2 minutes after the first push.)

## Customize

- Content: `index.html`
- Styles: `assets/css/style.css`
- Interactions: `assets/js/main.js`
- CV: `assets/cv/`
- Project previews: `assets/img/projects/`
