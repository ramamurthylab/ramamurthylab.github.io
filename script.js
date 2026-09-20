// Preserve links to sections of the original single-page website.
(() => {
  const paths = {'#research': '/research/', '#people': '/team/', '#publications': '/publications/', '#news': '/news/', '#contact': '/contact/', '#undergraduate-application': '/contact/#undergraduate-application'};
  const redirect = () => {
    if ((location.pathname === '/' || location.pathname === '/index.html') && paths[location.hash]) {
      location.replace(paths[location.hash]);
    }
  };
  redirect();
  window.addEventListener('hashchange', redirect);
})();

(() => {
  'use strict';
  const root = document.documentElement;
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  if (!toggle || !nav) return;

  root.classList.add('js');
  toggle.hidden = false;
  const closeMenu = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelector('span').textContent = '+';
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    toggle.querySelector('span').textContent = open ? '−' : '+';
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });
  const mobile = window.matchMedia('(max-width: 700px)');
  mobile.addEventListener('change', closeMenu);


})();

// Show complete entries that fit on the first screen, leaving room to expand.
(() => {
  'use strict';
  for (const [listId, toggleId, label] of [
    ['publications-list', 'publications-toggle', 'publications'],
    ['news-feed', 'news-toggle', 'news']
  ]) {
    const list = document.getElementById(listId);
    const toggle = document.getElementById(toggleId);
    if (!list || !toggle) continue;
    const entries = [...list.children];
    const section = list.closest('section');
    if (!entries.length || !section) continue;
    let expanded = false;
    let previewCount = entries.length;
    let frame = 0;

    function fitPreview() {
      if (expanded) return;
      entries.forEach(entry => { entry.hidden = false; });
      toggle.hidden = false;
      toggle.textContent = 'Show all ' + label;
      toggle.setAttribute('aria-expanded', 'false');

      const pageBottomSpace = parseFloat(getComputedStyle(section).paddingBottom) || 0;
      const viewportBottom = document.documentElement.clientHeight - pageBottomSpace;
      const bottoms = entries.map(entry => entry.getBoundingClientRect().bottom + window.scrollY);
      if (bottoms[bottoms.length - 1] <= viewportBottom) {
        previewCount = entries.length;
        toggle.hidden = true;
        return;
      }
      const toggleStyle = getComputedStyle(toggle);
      const toggleSpace = toggle.getBoundingClientRect().height +
        (parseFloat(toggleStyle.marginTop) || 0) + (parseFloat(toggleStyle.marginBottom) || 0);
      const cutoff = bottoms.findIndex(bottom => bottom > viewportBottom - toggleSpace);
      // Keep the first entry readable even on a screen too short for one full item.
      previewCount = Math.max(1, cutoff === -1 ? entries.length : cutoff);
      entries.forEach((entry, index) => { entry.hidden = index >= previewCount; });
      toggle.hidden = previewCount === entries.length;
    }

    function scheduleFit() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fitPreview);
    }

    toggle.addEventListener('click', () => {
      expanded = !expanded;
      if (expanded) {
        const firstNewEntry = entries[previewCount];
        entries.forEach(entry => { entry.hidden = false; });
        toggle.setAttribute('aria-expanded', 'true');
        toggle.textContent = label === 'news' ? 'Show less news' : 'Show fewer ' + label;
        // Continue keyboard navigation with the newly revealed content without jumping down.
        const next = firstNewEntry?.querySelector('a, summary, button') || firstNewEntry?.querySelector('h3');
        if (next) {
          if (!next.matches('a, summary, button')) next.tabIndex = -1;
          next.focus({preventScroll: true});
        }
      } else {
        fitPreview();
        toggle.focus({preventScroll: true});
        toggle.scrollIntoView({block: 'nearest'});
      }
    });

    fitPreview();
    document.fonts.ready.then(scheduleFit);
    window.addEventListener('load', scheduleFit);
    window.addEventListener('resize', scheduleFit);
    const header = document.querySelector('.site-header');
    if (header && typeof ResizeObserver !== 'undefined') new ResizeObserver(scheduleFit).observe(header);
  }
})();

// A quiet surprise: three separate visits to the pyramidal cell body.
(() => {
  'use strict';
  const soma = document.querySelector('.hero-visual #pyramidal-soma');
  const neuron = document.querySelector('.hero-visual #pyramidal-neuron');
  if (!soma || !neuron) return;

  const entryWindow = 10000;
  const highlightDuration = 10000;
  let visits = 0;
  let lastEntry = null;
  let inside = false;
  let highlightTimer = null;

  const resetVisits = () => {
    visits = 0;
    lastEntry = null;
  };

  soma.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse' || inside) return;
    inside = true;
    if (highlightTimer !== null) return;

    const now = performance.now();
    visits = lastEntry !== null && now - lastEntry < entryWindow ? visits + 1 : 1;
    lastEntry = now;
    if (visits < 3) return;

    resetVisits();
    neuron.classList.add('is-highlighted');
    highlightTimer = window.setTimeout(() => {
      neuron.classList.remove('is-highlighted');
      highlightTimer = null;
      resetVisits();
    }, highlightDuration);
  });

  soma.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse') inside = false;
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) resetVisits();
  });
})();
