(function () {
  var toggle = document.querySelector('[data-mobile-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var active = 0;
    var timer;

    function show(index) {
      if (!slides.length) {
        return;
      }

      active = (index + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === active);
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === active);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    function reset() {
      window.clearInterval(timer);
      start();
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(active - 1);
        reset();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(active + 1);
        reset();
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        reset();
      });
    });

    show(0);
    start();
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var regionSelect = document.querySelector('[data-filter-region]');
  var yearSelect = document.querySelector('[data-filter-year]');
  var genreSelect = document.querySelector('[data-filter-genre]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));

  function readQuery() {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');

    if (q && filterInput) {
      filterInput.value = q;
    }
  }

  function filterCards() {
    var keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var region = regionSelect ? regionSelect.value : '';
    var year = yearSelect ? yearSelect.value : '';
    var genre = genreSelect ? genreSelect.value : '';

    cards.forEach(function (card) {
      var text = (card.getAttribute('data-search') || '').toLowerCase();
      var cardRegion = card.getAttribute('data-region') || '';
      var cardYear = card.getAttribute('data-year') || '';
      var cardGenre = card.getAttribute('data-genre') || '';
      var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
      var matchRegion = !region || cardRegion === region;
      var matchYear = !year || cardYear === year;
      var matchGenre = !genre || cardGenre.indexOf(genre) !== -1;

      card.classList.toggle('hidden-card', !(matchKeyword && matchRegion && matchYear && matchGenre));
    });
  }

  if (cards.length) {
    readQuery();
    [filterInput, regionSelect, yearSelect, genreSelect].forEach(function (el) {
      if (el) {
        el.addEventListener('input', filterCards);
        el.addEventListener('change', filterCards);
      }
    });
    filterCards();
  }
})();
