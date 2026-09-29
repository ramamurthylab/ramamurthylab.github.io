(() => {
  const video = document.querySelector('#calcium-imaging-movie');
  if (!video) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = !('IntersectionObserver' in window);
  const updatePlayback = () => {
    if (visible && !reducedMotion.matches) video.play().catch(() => {});
    else video.pause();
  };
  reducedMotion.addEventListener('change', updatePlayback);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      updatePlayback();
    }, { threshold: 0.15 }).observe(video);
  }
  updatePlayback();
})();