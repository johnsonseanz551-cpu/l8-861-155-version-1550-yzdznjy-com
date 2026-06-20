(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var menuButton = document.querySelector(".menu-button");
  var mobileNav = document.querySelector(".mobile-nav");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = selectAll("[data-hero-slide]", hero);
    var dots = selectAll("[data-hero-dot]", hero);
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function startAuto() {
      if (timer) {
        window.clearInterval(timer);
      }

      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
        startAuto();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(index - 1);
        startAuto();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        showSlide(index + 1);
        startAuto();
      });
    }

    startAuto();
  }

  var video = document.querySelector(".js-player");
  var cover = document.querySelector(".js-player-cover");
  var attached = false;
  var hlsInstance = null;

  function attachVideo() {
    if (!video || attached || !window.__play) {
      return;
    }

    attached = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = window.__play;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(window.__play);
      hlsInstance.attachMedia(video);
      return;
    }

    video.src = window.__play;
  }

  function playVideo() {
    if (!video) {
      return;
    }

    attachVideo();

    if (cover) {
      cover.classList.add("is-hidden");
    }

    var promise = video.play();

    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {});
    }
  }

  if (video) {
    attachVideo();
    video.addEventListener("click", function () {
      if (video.paused) {
        playVideo();
      } else {
        video.pause();
      }
    });
  }

  if (cover) {
    cover.addEventListener("click", playVideo);
  }

  selectAll("[data-scroll-player]").forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      var player = document.querySelector(".player-shell");
      if (player) {
        player.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
      playVideo();
    });
  });

  var input = document.getElementById("site-search");
  var searchButton = document.getElementById("site-search-button");
  var results = document.getElementById("search-results");

  function safe(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderSearch(items) {
    if (!results) {
      return;
    }

    results.innerHTML = items.slice(0, 80).map(function (item) {
      return [
        "<article class=\"movie-card\">",
        "<a class=\"poster-link\" href=\"" + safe(item.url) + "\" aria-label=\"观看" + safe(item.title) + "\">",
        "<img src=\"" + safe(item.cover) + "\" alt=\"" + safe(item.title) + "\" loading=\"lazy\">",
        "<span class=\"play-dot\">▶</span>",
        "</a>",
        "<div class=\"movie-card-body\">",
        "<div class=\"card-meta\"><a href=\"" + safe(item.categoryUrl) + "\">" + safe(item.category) + "</a><span>" + safe(item.year) + "</span></div>",
        "<h3><a href=\"" + safe(item.url) + "\">" + safe(item.title) + "</a></h3>",
        "<p>" + safe(item.description) + "</p>",
        "<div class=\"card-tags\"><span>" + safe(item.region) + "</span><span>" + safe(item.type) + "</span></div>",
        "</div>",
        "</article>"
      ].join("");
    }).join("");
  }

  function runSearch() {
    if (!input || !window.searchData) {
      return;
    }

    var value = input.value.trim().toLowerCase();

    if (!value) {
      renderSearch(window.searchData.slice(0, 24));
      return;
    }

    var words = value.split(/\s+/).filter(Boolean);
    var matches = window.searchData.filter(function (item) {
      var haystack = [
        item.title,
        item.description,
        item.category,
        item.year,
        item.region,
        item.type,
        item.genre,
        item.tags
      ].join(" ").toLowerCase();
      return words.every(function (word) {
        return haystack.indexOf(word) !== -1;
      });
    });

    renderSearch(matches);
  }

  if (input && results) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";

    if (query) {
      input.value = query;
    }

    runSearch();
    input.addEventListener("input", runSearch);
  }

  if (searchButton) {
    searchButton.addEventListener("click", runSearch);
  }

  window.addEventListener("pagehide", function () {
    if (hlsInstance && typeof hlsInstance.destroy === "function") {
      hlsInstance.destroy();
    }
  });
})();
