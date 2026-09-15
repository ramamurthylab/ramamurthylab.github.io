# Ramamurthy Lab

Public website for the Ramamurthy Lab at the University of California, Riverside.

## Hosting

This is a static website with no build step. Publish the `main` branch from `/(root)` using GitHub Pages. See [GitHub’s publishing instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Editing

- Edit text, publications, team members, and the inline circuit artwork in `index.html`.
- Edit colors, typography, and layout in `styles.css`.
- The figure in the Approach section is `assets/whisker-attention-figure.svg`.
- News instructions and photo markup are in `NEWS-EDITING.md`.
- `application-config.js` sets the public Undergraduate RA application URL. The application is hosted separately by Google Apps Script; applicant responses and CVs are not stored in this repository.
- `assets/attention-circuit.svg` retains the editable circuit source. When changing its geometry, update the matching inline SVG between the circuit markers in `index.html` as well.

The local assets include the map renderer and geography, fonts, images, and browser icons. Preserve the bundled Leaflet and Manrope licenses and the OpenStreetMap attribution and source notes in `assets/MAP-DATA.md`.
