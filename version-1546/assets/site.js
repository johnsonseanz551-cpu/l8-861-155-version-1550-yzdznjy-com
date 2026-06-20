(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  ready(function () {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        nav.classList.toggle('open');
      });
    }

    document.querySelectorAll('img[data-fallback]').forEach(function (img) {
      img.addEventListener('error', function () {
        img.classList.add('is-hidden');
        var holder = img.closest('.poster-wrap, .hero-poster, .detail-poster, .ranking-poster');
        if (holder) {
          holder.classList.add('is-empty');
        }
      }, { once: true });
    });

    var hero = document.querySelector('[data-hero]');
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var prev = hero.querySelector('[data-hero-prev]');
      var next = hero.querySelector('[data-hero-next]');
      var index = 0;
      var timer = null;

      function show(nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('active', i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('active', i === index);
        });
      }

      function play() {
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5200);
      }

      function restart() {
        window.clearInterval(timer);
        play();
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          show(i);
          restart();
        });
      });

      if (prev) {
        prev.addEventListener('click', function () {
          show(index - 1);
          restart();
        });
      }

      if (next) {
        next.addEventListener('click', function () {
          show(index + 1);
          restart();
        });
      }

      show(0);
      play();
    }

    var forms = document.querySelectorAll('[data-filter-form]');
    forms.forEach(function (form) {
      var grid = document.querySelector('[data-search-grid]');
      if (!grid) {
        return;
      }
      var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-card]'));
      var textInput = form.querySelector('[data-filter-input]');
      var regionFilter = form.querySelector('[data-region-filter]');
      var typeFilter = form.querySelector('[data-type-filter]');
      var yearFilter = form.querySelector('[data-year-filter]');
      var params = new URLSearchParams(window.location.search);
      var initialQuery = params.get('q');

      if (initialQuery && textInput) {
        textInput.value = initialQuery;
      }

      function cardText(card) {
        return normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags')
        ].join(' '));
      }

      function apply() {
        var query = normalize(textInput ? textInput.value : '');
        var region = normalize(regionFilter ? regionFilter.value : '');
        var type = normalize(typeFilter ? typeFilter.value : '');
        var year = normalize(yearFilter ? yearFilter.value : '');

        cards.forEach(function (card) {
          var text = cardText(card);
          var ok = true;
          if (query && text.indexOf(query) === -1) {
            ok = false;
          }
          if (region && normalize(card.getAttribute('data-region')) !== region) {
            ok = false;
          }
          if (type && normalize(card.getAttribute('data-type')) !== type) {
            ok = false;
          }
          if (year && normalize(card.getAttribute('data-year')) !== year) {
            ok = false;
          }
          card.classList.toggle('is-hidden', !ok);
        });
      }

      form.addEventListener('submit', function (event) {
        event.preventDefault();
        apply();
      });

      form.addEventListener('input', apply);
      form.addEventListener('change', apply);
      apply();
    });
  });
})();
