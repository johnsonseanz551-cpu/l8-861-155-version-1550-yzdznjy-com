(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
    }

    function filterCards(input) {
        var target = input.getAttribute("data-filter-target") || "[data-movie-card]";
        var cards = Array.prototype.slice.call(document.querySelectorAll(target));
        var empty = document.querySelector(input.getAttribute("data-empty-target") || "[data-empty-state]");
        var keyword = normalize(input.value);
        var visibleCount = 0;

        cards.forEach(function (card) {
            var keywords = normalize(card.getAttribute("data-keywords"));
            var matched = !keyword || keywords.indexOf(keyword) !== -1;
            card.style.display = matched ? "" : "none";
            if (matched) {
                visibleCount += 1;
            }
        });

        if (empty) {
            empty.classList.toggle("is-visible", visibleCount === 0);
        }
    }

    function bindSearchForm(form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            var input = form.querySelector("input");
            var keyword = input ? input.value.trim() : "";
            var url = "search.html";
            if (keyword) {
                url += "?q=" + encodeURIComponent(keyword);
            }
            window.location.href = url;
        });
    }

    function bindHeroSlider(root) {
        var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
        var index = 0;

        if (slides.length < 2) {
            return;
        }

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                show(dotIndex);
            });
        });

        window.setInterval(function () {
            show(index + 1);
        }, 5200);
    }

    ready(function () {
        var toggle = document.querySelector("[data-menu-toggle]");
        var mobileNav = document.querySelector("[data-mobile-nav]");

        if (toggle && mobileNav) {
            toggle.addEventListener("click", function () {
                mobileNav.classList.toggle("is-open");
            });
        }

        Array.prototype.forEach.call(document.querySelectorAll("[data-site-search]"), bindSearchForm);

        Array.prototype.forEach.call(document.querySelectorAll("[data-filter-input]"), function (input) {
            input.addEventListener("input", function () {
                filterCards(input);
            });
        });

        var searchInput = document.querySelector("[data-search-page-input]");
        if (searchInput) {
            var params = new URLSearchParams(window.location.search);
            var query = params.get("q") || "";
            searchInput.value = query;
            filterCards(searchInput);
            searchInput.focus();
        }

        Array.prototype.forEach.call(document.querySelectorAll("[data-hero-slider]"), bindHeroSlider);
    });
})();
