(function () {
    function closestTarget(input) {
        var id = input.getAttribute('data-search-target');
        if (id) {
            return document.getElementById(id);
        }
        return document;
    }

    function applySearch(input) {
        var value = input.value.trim().toLowerCase();
        var target = closestTarget(input);
        var items = target.querySelectorAll('.movie-card, .rank-row');
        items.forEach(function (item) {
            var text = (item.getAttribute('data-search') || item.textContent || '').toLowerCase();
            item.classList.toggle('is-search-hidden', value !== '' && text.indexOf(value) === -1);
        });
    }

    function activateFilter(button) {
        var group = button.closest('[data-filter-group]');
        var targetId = group ? group.getAttribute('data-filter-group') : null;
        var target = targetId ? document.getElementById(targetId) : document;
        var value = button.getAttribute('data-category-filter');
        group.querySelectorAll('[data-category-filter]').forEach(function (item) {
            item.classList.toggle('active', item === button);
        });
        target.querySelectorAll('.movie-card, .rank-row').forEach(function (item) {
            var matched = value === 'all' || item.getAttribute('data-category') === value;
            item.classList.toggle('is-filtered-out', !matched);
        });
    }

    function attachHls(video, stream) {
        if (video.dataset.ready === '1') {
            return;
        }
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls();
            hls.loadSource(stream);
            hls.attachMedia(video);
            video._hls = hls;
        } else {
            video.src = stream;
        }
        video.dataset.ready = '1';
    }

    function startPlayer(shell) {
        var video = shell.querySelector('video');
        var cover = shell.querySelector('.player-cover');
        var stream = shell.getAttribute('data-stream');
        if (!video || !stream) {
            return;
        }
        attachHls(video, stream);
        if (cover) {
            cover.classList.add('is-hidden');
        }
        video.controls = true;
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {});
        }
    }

    function setupHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        if (slides.length <= 1) {
            return;
        }
        var current = 0;
        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, pos) {
                slide.classList.toggle('active', pos === current);
            });
            dots.forEach(function (dot, pos) {
                dot.classList.toggle('active', pos === current);
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
            });
        });
        setInterval(function () {
            show(current + 1);
        }, 5600);
    }

    function setupNavigation() {
        var toggle = document.querySelector('.mobile-toggle');
        var nav = document.querySelector('.main-nav');
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener('click', function () {
            var open = nav.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupNavigation();
        setupHero();
        document.querySelectorAll('.search-input').forEach(function (input) {
            input.addEventListener('input', function () {
                applySearch(input);
            });
        });
        document.querySelectorAll('[data-category-filter]').forEach(function (button) {
            button.addEventListener('click', function () {
                activateFilter(button);
            });
        });
        document.querySelectorAll('.player-shell').forEach(function (shell) {
            shell.addEventListener('click', function (event) {
                if (event.target.tagName && event.target.tagName.toLowerCase() === 'video' && shell.querySelector('video').dataset.ready === '1') {
                    return;
                }
                startPlayer(shell);
            });
            var cover = shell.querySelector('.player-cover');
            if (cover) {
                cover.addEventListener('click', function (event) {
                    event.preventDefault();
                    startPlayer(shell);
                });
            }
        });
    });
})();
