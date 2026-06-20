
(function () {
    function ready(callback) {
        if (document.readyState !== 'loading') {
            callback();
            return;
        }
        document.addEventListener('DOMContentLoaded', callback);
    }

    ready(function () {
        var menuButton = document.querySelector('[data-menu-toggle]');
        var mobilePanel = document.querySelector('[data-mobile-panel]');

        if (menuButton && mobilePanel) {
            menuButton.addEventListener('click', function () {
                mobilePanel.classList.toggle('is-open');
            });
        }

        document.querySelectorAll('.js-hero').forEach(function (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
            var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
            var previous = hero.querySelector('[data-hero-prev]');
            var next = hero.querySelector('[data-hero-next]');
            var index = 0;
            var timer = null;

            function show(nextIndex) {
                if (!slides.length) {
                    return;
                }
                index = (nextIndex + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle('is-active', slideIndex === index);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle('is-active', dotIndex === index);
                });
            }

            function restart() {
                if (timer) {
                    clearInterval(timer);
                }
                timer = setInterval(function () {
                    show(index + 1);
                }, 5200);
            }

            dots.forEach(function (dot) {
                dot.addEventListener('click', function () {
                    show(Number(dot.dataset.heroDot || 0));
                    restart();
                });
            });

            if (previous) {
                previous.addEventListener('click', function () {
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
            restart();
        });

        document.querySelectorAll('.js-filter-form').forEach(function (form) {
            var input = form.querySelector('input[type="search"]');
            var scope = form.closest('section') || document;
            var grid = scope.querySelector('.js-filter-grid');
            var count = scope.querySelector('[data-filter-count]');

            if (!input || !grid) {
                return;
            }

            var items = Array.prototype.slice.call(grid.querySelectorAll('[data-search]'));

            function filter() {
                var query = input.value.trim().toLowerCase();
                var shown = 0;

                items.forEach(function (item) {
                    var text = (item.dataset.search || '').toLowerCase();
                    var matched = !query || text.indexOf(query) !== -1;
                    item.classList.toggle('is-filtered-out', !matched);
                    if (matched) {
                        shown += 1;
                    }
                });

                if (count) {
                    count.textContent = query ? '找到 ' + shown + ' 条相关内容' : '';
                }
            }

            form.addEventListener('submit', function (event) {
                event.preventDefault();
                filter();
            });

            input.addEventListener('input', filter);
        });
    });
})();
