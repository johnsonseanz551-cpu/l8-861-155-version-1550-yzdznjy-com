(function () {
    document.querySelectorAll('[data-video-source]').forEach(function (frame) {
        var video = frame.querySelector('video');
        var button = frame.querySelector('.player-cover');
        var source = frame.getAttribute('data-video-source');
        var loaded = false;
        var hls = null;

        if (!video || !source) {
            return;
        }

        function bindSource() {
            if (loaded) {
                return Promise.resolve();
            }

            loaded = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                return Promise.resolve();
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });

                hls.loadSource(source);
                hls.attachMedia(video);

                window.addEventListener('pagehide', function () {
                    if (hls) {
                        hls.destroy();
                        hls = null;
                    }
                }, { once: true });

                return new Promise(function (resolve) {
                    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        resolve();
                    });
                    window.setTimeout(resolve, 1200);
                });
            }

            video.src = source;
            return Promise.resolve();
        }

        function startPlayback() {
            frame.classList.add('is-loading');

            bindSource().then(function () {
                if (button) {
                    button.classList.add('is-hidden');
                }

                frame.classList.remove('is-loading');
                frame.classList.add('is-playing');

                var playRequest = video.play();

                if (playRequest && typeof playRequest.catch === 'function') {
                    playRequest.catch(function () {
                        frame.classList.remove('is-playing');

                        if (button) {
                            button.classList.remove('is-hidden');
                        }
                    });
                }
            });
        }

        if (button) {
            button.addEventListener('click', startPlayback);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                startPlayback();
            }
        });
    });
})();
