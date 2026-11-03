# Rovera Ventures

| Folder | What's inside |
|---|---|
| `website/` | **The live website.** `index.html`, `styles.css`, `main.js`, plus `assets/img` and `assets/video`. |
| `film/` | Remotion project that makes the videos (`HeroLoop`, `BrandFilm`, `SkylineFilm`). Rendered files go to `film/out/`. |
| `wordings/` | Website copy: v1 and v2 (luxury), as Markdown and PDF. |
| `source-media/` | Original raw footage and photos (not loaded by the website). |

**Owner / contact:** Varun Sudamshetty · +91 97429 58693 · svarunroyal999@gmail.com

## Run the website locally
```
cd website && python3 -m http.server 5500
```
Then open http://localhost:5500

## Edit or re-render the films
```
cd film
npx remotion studio                  # preview at http://localhost:3000
npx remotion render SkylineFilm out/rovera-skyline-film.mp4
```
Copy finished renders into `website/assets/video/`.

## Still to fill before launch
Estate names, stats, real testimonials, office address, RERA number. The enquiry form currently opens an email to the owner, pre-filled; it has no backend.
