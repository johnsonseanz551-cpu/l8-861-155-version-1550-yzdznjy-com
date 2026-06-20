(function () {
  function setupPlayer(box) {
    var video = box.querySelector('video');
    var startButton = box.querySelector('.player-start');
    var playButton = box.querySelector('[data-player-play]');
    var muteButton = box.querySelector('[data-player-mute]');
    var fullscreenButton = box.querySelector('[data-player-fullscreen]');
    var message = box.querySelector('[data-player-message]');
    var stream = box.getAttribute('data-stream');
    var ready = false;
    var hls = null;

    function showMessage(text) {
      if (message) {
        message.textContent = text;
        message.classList.add('show');
      }
    }

    function loadStream() {
      if (ready || !video || !stream) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        ready = true;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        ready = true;
        return;
      }

      showMessage('播放暂不可用');
    }

    function play() {
      loadStream();

      if (!video || !ready) {
        return;
      }

      var promise = video.play();

      if (promise && typeof promise.then === 'function') {
        promise.then(function () {
          box.classList.add('playing');
          if (startButton) {
            startButton.classList.add('hidden');
          }
        }).catch(function () {
          showMessage('点击画面继续播放');
        });
      } else {
        box.classList.add('playing');
        if (startButton) {
          startButton.classList.add('hidden');
        }
      }
    }

    function togglePlay() {
      if (!video) {
        return;
      }

      if (video.paused) {
        play();
      } else {
        video.pause();
        box.classList.remove('playing');
      }
    }

    if (startButton) {
      startButton.addEventListener('click', play);
    }

    if (playButton) {
      playButton.addEventListener('click', togglePlay);
    }

    if (video) {
      video.addEventListener('click', togglePlay);
      video.addEventListener('play', function () {
        box.classList.add('playing');
        if (startButton) {
          startButton.classList.add('hidden');
        }
      });
      video.addEventListener('pause', function () {
        box.classList.remove('playing');
      });
    }

    if (muteButton && video) {
      muteButton.addEventListener('click', function () {
        video.muted = !video.muted;
        muteButton.textContent = video.muted ? '取消静音' : '静音';
      });
    }

    if (fullscreenButton) {
      fullscreenButton.addEventListener('click', function () {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else if (box.requestFullscreen) {
          box.requestFullscreen();
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setupPlayer);
  });
})();
