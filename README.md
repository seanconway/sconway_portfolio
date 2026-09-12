# Engineering Portfolio

A single-page static portfolio site — no build step, no framework. Open
`index.html` directly in a browser, or serve the folder with any static
file server.

## Structure

```
index.html      All page content and structure
styles.css      Dark, technical theme
script.js       Tab switching, missing-media placeholders, photo lightbox
assets/         Drop your real photos/schematics/renders/videos in here
README.md       This file
```

## How to fill it in

1. **Header text**: open `index.html` and replace the placeholders:
   - `Your Name` (appears in the nav brand, `<h1>`, and footer)
   - Tagline text in `.hero-tagline`
   - `mailto:your.email@example.com`, the LinkedIn URL, and the GitHub URL
     (each appears twice — hero and footer)
   - Every `[Description: ...]` paragraph (styled in red/italic so they're
     easy to spot — that styling comes from the `.placeholder-text` class,
     remove the class once you've written real copy)

2. **Media**: each project section references files under `assets/`, e.g.
   `assets/refremote/perfboard/photo.jpg`. Just save your real files with
   those exact names (or update the `src=`/`<source src=`) and they'll
   appear automatically. Anything still missing renders as a labeled
   dashed placeholder box telling you the expected kind and path, instead
   of a broken-image icon.

   Expected assets by project:

   - **RefRemote**
     - Perfboard: `photo.jpg`, `schematic.png`, `demo.mp4`
     - PCB Rev 1: `photo.jpg`, `schematic.png`, `render.png`
     - PCB Rev 2: `photo-unenclosed.jpg`, `photo-enclosed.jpg`,
       `schematic.png`, `render.png`, `enclosure-exploded.png`
     - PCB Rev 3: `schematic.png`, `render.png`
   - **Capstone**: `photo1.jpg`, `photo2.jpg`, `photo3.jpg`, `demo.mp4`
     (add more `<figure class="media-item">` blocks in `index.html` for
     additional photos)
   - **Coil Gun**: `photo.jpg`, `demo.mp4`
   - **Profile**: `assets/profile/photo.jpg`

   Videos: if you'd rather embed YouTube/Vimeo than host an `.mp4`,
   replace the `<video>...</video>` block with an `<iframe>` embed.

3. **Adding more projects**: copy one of the `<section class="project">`
   blocks in `index.html`, give it a new `id`, and add a matching link in
   the header `<nav>`.

## Previewing

Just double-click `index.html` — everything is self-contained (no server
required, no external dependencies). If you want a local server instead
(e.g. to test relative paths exactly as they'd behave when deployed):

```
# Python
python -m http.server 8000

# Node
npx serve .
```

Then visit `http://localhost:8000`.

## Deploying

This is a static site, so any static host works. GitHub Pages is the
easiest free option:

1. Push this folder to a GitHub repo.
2. Repo Settings → Pages → deploy from the `main` branch, root folder.
3. Your site will be live at `https://<username>.github.io/<repo>/`.
