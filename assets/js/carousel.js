document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.logo-track');
  if (!track) return;

  // Build exactly two identical groups from unique images (by src) for a perfect -50% loop
  const build = () => {
    const originals = Array.from(track.querySelectorAll('.logo-item'));
    const seen = new Set();
    const uniques = [];
    for (const item of originals) {
      const img = item.querySelector('img');
      if (!img) continue;
      const key = img.getAttribute('src');
      if (seen.has(key)) continue;
      seen.add(key);
      uniques.push(item.cloneNode(true));
    }

    track.innerHTML = '';
    const g1 = document.createElement('div');
    g1.className = 'logo-group';
    const g2 = document.createElement('div');
    g2.className = 'logo-group';
    uniques.forEach(c => g1.appendChild(c.cloneNode(true)));
    uniques.forEach(c => g2.appendChild(c.cloneNode(true)));
    track.appendChild(g1);
    track.appendChild(g2);
    return { g1, g2 };
  };

  const waitForImages = (root) => {
    const imgs = Array.from(root.querySelectorAll('img'));
    return Promise.all(
      imgs.map(img => img.complete ? Promise.resolve() : new Promise(res => img.addEventListener('load', res, { once: true })))
    );
  };

  const setAnimation = (g1) => {
    const rectW = g1.getBoundingClientRect().width; // content width (no margins)
    const seam = (() => {
      const last = g1.lastElementChild;
      return last ? parseFloat(getComputedStyle(last).marginRight) || 0 : 0;
    })();
    const distance = rectW + seam; // px, may be fractional
    track.style.setProperty('--scroll-distance', `${distance}px`);

    // restart animation using a precise speed-based duration (~35px/s)
    const duration = Math.max(20, distance / 35);
    track.style.animation = 'none';
    // force reflow
    void track.offsetWidth;
    track.style.animation = `scroll-logos ${duration}s linear infinite`;
  };

  let groups = build();
  waitForImages(track).then(() => setAnimation(groups.g1));

  // Recalculate on resize/orientation/font ready (handles responsive size changes)
  let raf;
  const recalc = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(async () => {
      groups = build();
      await waitForImages(track);
      setAnimation(groups.g1);
    });
  };
  window.addEventListener('resize', recalc);
  window.addEventListener('orientationchange', recalc);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(recalc).catch(() => {});
  }

  // Ensure always running
  track.style.animationPlayState = 'running';
});
