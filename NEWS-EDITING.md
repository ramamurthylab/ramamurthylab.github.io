# Updating News

Add each new `<article class="news-entry">` at the **top** of `.news-feed` in `news/index.html`, so the newest item appears first. All entries appear on the News page, newest first.

Each entry needs a date and headline. Photos are optional: keep an entry without photos as a plain article, or add the `<details class="news-photos">` block shown below. Visitors can click **View photos** to open that entry’s photos and **Hide photos** to close them. Images keep their original proportions and are not cropped.

Save photos in `assets/news/` using filenames without spaces. Commit the edited `news/index.html` and new photo files to the publishing branch to update the site.

## Example entry with optional photos

This is a template only. Replace the sample date, bracketed text, and placeholder filename before publishing. Write meaningful alt text describing the particular people, activity, or setting pictured; do not leave the instructional placeholder below as alt text. Add more `<figure>` blocks for additional photos. Captions are optional.

```html
<article class="news-entry">
  <time class="news-date" datetime="2026-09">September 2026</time>
  <h3>[News headline]</h3>
  <details class="news-photos">
    <summary>
      <span class="news-photos-open-label">View photos</span>
      <span class="news-photos-close-label">Hide photos</span>
    </summary>
    <div class="news-gallery">
      <figure>
        <img src="/assets/news/replace-with-your-photo.jpg"
             alt="[Describe what is shown in this particular photo.]"
             loading="lazy" decoding="async">
        <figcaption>[Optional photo caption]</figcaption>
      </figure>
    </div>
  </details>
</article>
```

For an entry without photos, omit the entire `<details>` block. This template is not a news item and does not appear on the live page.
