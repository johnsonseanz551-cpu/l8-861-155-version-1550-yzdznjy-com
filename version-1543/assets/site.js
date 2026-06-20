(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function setupMenu() {
    const toggle = $('[data-menu-toggle]');
    const menu = $('[data-menu-panel]');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function setupScroller() {
    const track = $('[data-feature-track]');
    if (!track) return;
    const prev = $('[data-scroll-prev]');
    const next = $('[data-scroll-next]');
    const step = () => Math.max(280, track.clientWidth * 0.8);
    prev && prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next && next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  }

  function setupLiveFilter() {
    const input = $('[data-live-filter]');
    if (!input) return;
    const cards = $$('[data-filter-card]');
    input.addEventListener('input', () => {
      const key = input.value.trim().toLowerCase();
      cards.forEach((card) => {
        const text = (card.getAttribute('data-search') || '').toLowerCase();
        card.style.display = !key || text.includes(key) ? '' : 'none';
      });
    });
  }

  function setupPlayer() {
    const wrap = $('[data-player-wrap]');
    const video = $('[data-player-video]');
    const button = $('[data-player-button]');
    const source = wrap && wrap.getAttribute('data-src');
    if (!wrap || !video || !source) return;

    const startPlayback = async () => {
      wrap.classList.add('is-playing');
      const canNative = video.canPlayType('application/vnd.apple.mpegurl');
      if (window.Hls && Hls.isSupported()) {
        if (!video.dataset.hlsAttached) {
          const hls = new Hls({ enableWorker: true });
          hls.loadSource(source);
          hls.attachMedia(video);
          video.dataset.hlsAttached = '1';
          video._hls = hls;
        }
      } else if (canNative) {
        if (video.src !== source) video.src = source;
      } else {
        if (video.src !== source) video.src = source;
      }
      try {
        await video.play();
      } catch (err) {
        // silent fallback
      }
    };

    if (button) button.addEventListener('click', startPlayback);
    wrap.addEventListener('click', (e) => {
      if (e.target === button) return;
      if (!wrap.classList.contains('is-playing')) startPlayback();
    });
  }

  function setupSearchPage() {
    const app = $('[data-search-app]');
    if (!app) return;
    const input = $('[data-search-input]');
    const typeSel = $('[data-search-type]');
    const regionSel = $('[data-search-region]');
    const yearSel = $('[data-search-year]');
    const results = $('[data-search-results]');
    const counter = $('[data-search-counter]');
    const data = window.MOVIES_DATA || [];

    const render = () => {
      const q = (input.value || '').trim().toLowerCase();
      const type = (typeSel.value || '').trim();
      const region = (regionSel.value || '').trim();
      const year = (yearSel.value || '').trim();
      const filtered = data.filter((item) => {
        const hit = !q || [item.title, item.genre, item.region, item.type, item.tags.join(' '), item.one_line].join(' ').toLowerCase().includes(q);
        const hitType = !type || item.type === type;
        const hitRegion = !region || item.region === region;
        const hitYear = !year || String(item.year) === year;
        return hit && hitType && hitRegion && hitYear;
      });
      counter.textContent = String(filtered.length);
      results.innerHTML = filtered.slice(0, 120).map((item) => `
        <a class="movie-card" href="${item.url}" data-filter-card data-search="${item.title} ${item.genre} ${item.region} ${item.type} ${item.tags.join(' ')} ${item.one_line}">
          <span class="movie-poster" style="background-image: linear-gradient(160deg, rgba(14,165,233,.18), rgba(13,148,136,.2)), url('${item.cover}')"></span>
          <span class="movie-meta">
            <strong>${item.title}</strong>
            <span>${item.year} · ${item.type} · ${item.region}</span>
          </span>
        </a>`).join('') || '<div class="empty-state">没有找到符合条件的内容。</div>';
    };

    [input, typeSel, regionSel, yearSel].forEach((el) => el && el.addEventListener('input', render));
    [typeSel, regionSel, yearSel].forEach((el) => el && el.addEventListener('change', render));
    render();
  }

  setupMenu();
  setupScroller();
  setupLiveFilter();
  setupPlayer();
  setupSearchPage();
})();