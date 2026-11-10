# Event photo gallery

The Photos page shows all photos from one event together. Its triangular arrows
move to the previous or next event, stopping at the ends. A single event has no
arrows; an empty gallery shows only “Photos coming soon.”

## Adding an event

1. Put its photos in `assets/photos/<event-slug>/`. Optimize copies for the web,
   preserve their proportions, and remove unnecessary location metadata.
2. Add one article inside `#photo-events` in `photos/index.html`, using the
   structure below. Place newer events first. Use unique IDs and real titles,
   dates, dimensions, and descriptive alternative text. Captions are optional.
3. When adding the first event, remove `hidden` from `#photo-gallery` and remove
   the `#photos-empty` paragraph so the photos remain available without JavaScript.
4. Add all of that event's figures inside its `.photo-event-grid`. Photos keep
   their full aspect ratios, in two columns on desktop and one on phones.
5. Bump `gallery.css?v=…` or `gallery.js?v=…` in this page if those files change.

```html
<article class="photo-event" id="event-slug" aria-labelledby="event-slug-title">
  <header class="photo-event-heading">
    <h2 id="event-slug-title">Event title</h2>
    <time class="photo-event-date" datetime="YYYY-MM-DD">Month Day, Year</time>
  </header>
  <div class="photo-event-grid">
    <figure>
      <a href="/assets/photos/event-slug/photo-01.jpg">
        <img src="/assets/photos/event-slug/photo-01.jpg" width="1600" height="1200"
             alt="Describe this photo." loading="lazy" decoding="async">
      </a>
      <figcaption>Optional caption.</figcaption>
    </figure>
  </div>
</article>
```

With JavaScript, only the selected event is visible. Without JavaScript, all
event articles remain visible in order. Previous/next buttons have accessible
labels and announce the selected event. Left/right keys also navigate events
when a control has keyboard focus.

## Halloween 2026 collage

This event adds `photo-event-grid--collage` to the standard grid. Its four
photos share one outer frame and fit in one row, alternating decorations and people:
IMG_0040, IMG_0068, IMG_0059, IMG_0096. IMG_0059 is intentionally the narrowest
panel and has the smallest area. All four panels have the same height and touch
edge to edge, without rotations, overlap, interior padding, or gaps.
`object-fit: cover` crops the panels without stretching the images. IMG_0059
uses `object-position: center 85%` to keep the doll and model brain visible.
The event title matches the publication-title font, size, weight, and black color.
Every image still links to the uncropped original. The row
scales down on narrow screens, with IMG_0059 remaining proportionally smaller.
The gallery always reserves a column on each side for its triangular event
arrows, so adding a second event does not shift or shrink the photo row.
