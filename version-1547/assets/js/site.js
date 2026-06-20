(function () {
    function qs(selector, scope) {
        return (scope || document).querySelector(selector);
    }

    function qsa(selector, scope) {
        return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
    }

    qsa('[data-cover]').forEach(function (image) {
        image.addEventListener('error', function () {
            var shell = image.closest('.poster-shell, .hero-feature-cover');
            if (shell) {
                shell.classList.add('cover-fallback');
            }
            image.remove();
        });
    });

    var navToggle = qs('[data-nav-toggle]');
    var mobilePanel = qs('[data-mobile-panel]');
    if (navToggle && mobilePanel) {
        navToggle.addEventListener('click', function () {
            mobilePanel.classList.toggle('open');
        });
    }

    qsa('[data-header-search]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var input = qs('input[name="q"]', form);
            var query = input ? input.value.trim() : '';
            if (query) {
                window.location.href = 'library.html?q=' + encodeURIComponent(query);
            } else {
                window.location.href = 'library.html';
            }
        });
    });

    var hero = qs('[data-hero-slider]');
    if (hero) {
        var slides = qsa('[data-hero-slide]', hero);
        var dots = qsa('[data-hero-dot]', hero);
        var heroImages = qsa('[data-hero-image]', hero);
        var panelImages = qsa('[data-panel-image]', hero);
        var activeIndex = 0;
        var timer = null;

        function activate(index) {
            if (!slides.length) {
                return;
            }
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === activeIndex);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === activeIndex);
            });
            heroImages.forEach(function (image, imageIndex) {
                image.classList.toggle('active', imageIndex === activeIndex);
            });
            panelImages.forEach(function (image, imageIndex) {
                image.classList.toggle('active', imageIndex === activeIndex);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                activate(activeIndex + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                activate(index);
                start();
            });
        });

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        activate(0);
        start();
    }

    var filterArea = qs('[data-filter-area]');
    if (filterArea) {
        var form = qs('[data-filter-form]', filterArea);
        var cards = qsa('[data-title]', filterArea);
        var emptyState = qs('[data-empty-state]', filterArea);
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q') || '';
        var keywordInput = qs('[data-filter-keyword]', filterArea);

        if (keywordInput && initialQuery) {
            keywordInput.value = initialQuery;
        }

        function normalize(value) {
            return (value || '').toString().toLowerCase().trim();
        }

        function matchCard(card, filters) {
            var haystack = normalize([
                card.dataset.title,
                card.dataset.genre,
                card.dataset.year,
                card.dataset.region,
                card.dataset.type,
                card.dataset.tags
            ].join(' '));
            if (filters.keyword && haystack.indexOf(filters.keyword) === -1) {
                return false;
            }
            if (filters.genre && normalize(card.dataset.genre).indexOf(filters.genre) === -1) {
                return false;
            }
            if (filters.year && normalize(card.dataset.year) !== filters.year) {
                return false;
            }
            if (filters.region && normalize(card.dataset.region) !== filters.region) {
                return false;
            }
            if (filters.type && normalize(card.dataset.type) !== filters.type) {
                return false;
            }
            return true;
        }

        function applyFilters() {
            var filters = {
                keyword: normalize(keywordInput ? keywordInput.value : ''),
                genre: normalize(qs('[data-filter-genre]', filterArea) ? qs('[data-filter-genre]', filterArea).value : ''),
                year: normalize(qs('[data-filter-year]', filterArea) ? qs('[data-filter-year]', filterArea).value : ''),
                region: normalize(qs('[data-filter-region]', filterArea) ? qs('[data-filter-region]', filterArea).value : ''),
                type: normalize(qs('[data-filter-type]', filterArea) ? qs('[data-filter-type]', filterArea).value : '')
            };
            var visible = 0;
            cards.forEach(function (card) {
                var matched = matchCard(card, filters);
                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visible += 1;
                }
            });
            if (emptyState) {
                emptyState.classList.toggle('show', visible === 0);
            }
        }

        if (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                applyFilters();
            });
            qsa('input, select', form).forEach(function (control) {
                control.addEventListener('input', applyFilters);
                control.addEventListener('change', applyFilters);
            });
        }
        applyFilters();
    }
})();
