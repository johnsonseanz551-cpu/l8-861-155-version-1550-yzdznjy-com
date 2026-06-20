(function () {
    window.bindMoviePlayer = function (options) {
        var video = document.getElementById(options.videoId);
        var cover = document.getElementById(options.coverId);
        var button = document.getElementById(options.buttonId);
        var started = false;
        var hls = null;

        if (!video || !options.videoUrl) {
            return;
        }

        function hideCover() {
            if (cover) {
                cover.classList.add("is-hidden");
            }
        }

        function startVideo() {
            hideCover();

            if (!started) {
                started = true;

                if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(options.videoUrl);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        video.play().catch(function () {});
                    });
                } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = options.videoUrl;
                    video.addEventListener("loadedmetadata", function () {
                        video.play().catch(function () {});
                    }, { once: true });
                } else {
                    video.src = options.videoUrl;
                    video.play().catch(function () {});
                }
            } else {
                video.play().catch(function () {});
            }
        }

        if (button) {
            button.addEventListener("click", startVideo);
        }

        if (cover) {
            cover.addEventListener("click", startVideo);
        }

        video.addEventListener("click", function () {
            if (!started) {
                startVideo();
            }
        });

        video.addEventListener("play", hideCover);
        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    };
})();
