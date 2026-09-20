# Updating News

Add each new `<article class="news-entry">` at the **top** of `.news-feed` in `news/index.html`, so the newest item appears first. The page initially shows as many complete entries as fit on the screen, newest first. When more entries are available, “Show all news” reveals them; “Show less news” returns to the compact view. Keep the `news-toggle` button after the feed.

Each entry needs a date and headline. Photos are optional: keep an entry without photos as a plain article, or add the `<div class="news-gallery">` block shown below. Photos appear automatically when their entry is visible, with no separate photo toggle. Photos are centered horizontally within the news column and share the Team photo’s off-white frame, fine border, and soft shadow. Images keep their original proportions without cropping or upscaling, with a maximum displayed image width of 520px. Include the image’s actual pixel width and height on its `<img>` element to reserve space while it loads.

Save photos in `assets/news/` using filenames without spaces. Commit the edited `news/index.html` and new photo files to the publishing branch to update the site.

## Example entry with optional photos

This is a template only. Replace the sample date, bracketed text, and placeholder filename before publishing. Write meaningful alt text describing the particular people, activity, or setting pictured; do not leave the instructional placeholder below as alt text. Add more `<figure>` blocks for additional photos. Captions are optional.

```html
<article class="news-entry">
  <time class="news-date" datetime="2026-09">September 2026</time>
  <h3>[News headline]</h3>
  <div class="news-gallery">
    <figure>
      <img src="/assets/news/replace-with-your-photo.jpg"
           alt="[Describe what is shown in this particular photo.]"
           loading="lazy" decoding="async">
      <figcaption>[Optional photo caption]</figcaption>
    </figure>
  </div>
</article>
```

For an entry without photos, omit the entire `.news-gallery` block. This template is not a news item and does not appear on the live page.
