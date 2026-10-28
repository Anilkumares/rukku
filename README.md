# Rukma V S — Portfolio

Personal portfolio of **Rukma V S**, Software Test Engineer.

**Live site:** https://anilkumares.github.io/rukku/

A single-page static site (HTML, CSS and a little JavaScript) with no build step. All content comes from Rukma's resume, which is also downloadable from the site (`assets/Rukma_VS_Software_Test_Engineer_Resume.pdf`).

## Structure

```
index.html      page content
styles.css      bento layout, dark/light themes, responsive rules
script.js       menu, theme toggle, active section, card spotlight, copy buttons
favicon.svg     "RV" monogram
assets/         resume PDF
```

## Updating

- **Text:** edit `index.html` directly; each section is marked with a comment.
- **Resume:** replace `assets/Rukma_VS_Software_Test_Engineer_Resume.pdf`, keeping the same file name.
- **Publishing:** pushes to `main` are deployed automatically by GitHub Pages.

To preview locally, open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.
