(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function attach(video, url) {
    if (!video || !url || video.dataset.attached === '1') {
      return;
    }

    video.dataset.attached = '1';

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(url);
      hls.attachMedia(video);
      video._hlsInstance = hls;
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      return;
    }

    video.src = url;
  }

  ready(function () {
    document.querySelectorAll('.stream-player').forEach(function (video) {
      var shell = video.closest('.video-shell');
      var button = shell ? shell.querySelector('.play-cover') : null;
      var url = video.getAttribute('data-video-url');

      attach(video, url);

      function play() {
        attach(video, url);
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {});
        }
      }

      if (button) {
        button.addEventListener('click', play);
      }

      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });

      video.addEventListener('play', function () {
        if (shell) {
          shell.classList.add('is-playing');
        }
      });

      video.addEventListener('pause', function () {
        if (shell) {
          shell.classList.remove('is-playing');
        }
      });
    });
  });
})();
