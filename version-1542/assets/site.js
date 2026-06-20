(function () {
  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
    } else {
      document.addEventListener("DOMContentLoaded", callback);
    }
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector(".mobile-nav");

    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        mobileNav.classList.toggle("is-open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var currentSlide = 0;
    var heroTimer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      currentSlide = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === currentSlide);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === currentSlide);
      });
    }

    function startHeroTimer() {
      if (slides.length <= 1) {
        return;
      }

      heroTimer = window.setInterval(function () {
        showSlide(currentSlide + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        if (heroTimer) {
          window.clearInterval(heroTimer);
        }

        showSlide(index);
        startHeroTimer();
      });
    });

    showSlide(0);
    startHeroTimer();

    var searchInput = document.querySelector(".movie-search");
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll(".filter-chip"));
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
    var emptyCard = document.querySelector(".empty-card");
    var activeFilter = "all";

    function applyFilters() {
      if (!cards.length) {
        return;
      }

      var keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
      var visibleCount = 0;

      cards.forEach(function (card) {
        var text = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
        var category = card.getAttribute("data-category") || "";
        var matchesText = !keyword || text.indexOf(keyword) !== -1;
        var matchesFilter = activeFilter === "all" || category === activeFilter;
        var visible = matchesText && matchesFilter;

        card.style.display = visible ? "" : "none";

        if (visible) {
          visibleCount += 1;
        }
      });

      if (emptyCard) {
        emptyCard.classList.toggle("is-visible", visibleCount === 0);
      }
    }

    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        activeFilter = button.getAttribute("data-filter") || "all";

        filterButtons.forEach(function (item) {
          item.classList.toggle("is-active", item === button);
        });

        applyFilters();
      });
    });

    applyFilters();

    Array.prototype.slice.call(document.querySelectorAll(".player-panel")).forEach(function (panel) {
      var video = panel.querySelector("video");
      var cover = panel.querySelector(".player-cover");
      var hlsInstance = null;

      function startPlayback() {
        if (!video) {
          return;
        }

        var stream = video.getAttribute("data-stream");

        if (!stream) {
          return;
        }

        if (!video.getAttribute("data-ready")) {
          if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = stream;
          } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
              enableWorker: true,
              lowLatencyMode: false
            });
            hlsInstance.loadSource(stream);
            hlsInstance.attachMedia(video);
          } else {
            video.src = stream;
          }

          video.setAttribute("data-ready", "true");
        }

        if (cover) {
          cover.classList.add("is-hidden");
        }

        var playResult = video.play();

        if (playResult && typeof playResult.catch === "function") {
          playResult.catch(function () {});
        }
      }

      if (cover) {
        cover.addEventListener("click", startPlayback);
      }

      panel.addEventListener("click", function (event) {
        if (event.target === video && video.paused) {
          startPlayback();
        }
      });

      if (video) {
        video.addEventListener("play", function () {
          if (cover) {
            cover.classList.add("is-hidden");
          }
        });
      }

      window.addEventListener("pagehide", function () {
        if (hlsInstance && typeof hlsInstance.destroy === "function") {
          hlsInstance.destroy();
        }
      });
    });
  });
})();
