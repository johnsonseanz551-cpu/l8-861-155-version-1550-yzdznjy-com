(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('[data-slider]').forEach(function (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-slide]'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-slide-dot]'));
        var prev = slider.querySelector('[data-slide-prev]');
        var next = slider.querySelector('[data-slide-next]');
        var active = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }

            active = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === active);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === active);
            });
        }

        function restart() {
            if (timer) {
                clearInterval(timer);
            }

            timer = setInterval(function () {
                show(active + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(active - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(active + 1);
                restart();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-slide-dot')) || 0);
                restart();
            });
        });

        show(0);
        restart();
    });

    function readQuery(name) {
        var params = new URLSearchParams(window.location.search);
        return params.get(name) || '';
    }

    document.querySelectorAll('.content-section').forEach(function (section) {
        var search = section.querySelector('.movie-search');
        var genre = section.querySelector('.genre-filter');
        var cards = Array.prototype.slice.call(section.querySelectorAll('.movie-card'));
        var empty = section.querySelector('[data-empty-state]');

        if (!search && !genre) {
            return;
        }

        if (search && readQuery('q')) {
            search.value = readQuery('q');
        }

        function applyFilter() {
            var query = search ? search.value.trim().toLowerCase() : '';
            var genreValue = genre ? genre.value.trim().toLowerCase() : '';
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = card.getAttribute('data-search') || '';
                var genres = (card.getAttribute('data-genre') || '').toLowerCase();
                var matchedText = !query || haystack.indexOf(query) !== -1;
                var matchedGenre = !genreValue || genres.indexOf(genreValue) !== -1;
                var matched = matchedText && matchedGenre;

                card.style.display = matched ? '' : 'none';

                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }

        if (search) {
            search.addEventListener('input', applyFilter);
        }

        if (genre) {
            genre.addEventListener('change', applyFilter);
        }

        applyFilter();
    });
})();
