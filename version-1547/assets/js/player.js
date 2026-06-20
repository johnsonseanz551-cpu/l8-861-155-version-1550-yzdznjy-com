(function () {
    var hlsPromise = null;

    function loadHls() {
        if (window.Hls) {
            return Promise.resolve(window.Hls);
        }
        if (hlsPromise) {
            return hlsPromise;
        }
        hlsPromise = new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
            script.async = true;
            script.onload = function () {
                resolve(window.Hls);
            };
            script.onerror = function () {
                reject(new Error('hls-load-failed'));
            };
            document.head.appendChild(script);
        });
        return hlsPromise;
    }

    function setupPlayer(player) {
        var video = player.querySelector('video');
        var button = player.querySelector('[data-play-button]');
        var status = player.querySelector('[data-player-status]');
        var source = player.getAttribute('data-src');
        var hlsInstance = null;
        var attached = false;

        if (!video || !source) {
            return;
        }

        function setStatus(text) {
            if (status) {
                status.textContent = text;
            }
        }

        function playVideo() {
            var playCall = video.play();
            if (playCall && typeof playCall.catch === 'function') {
                playCall.catch(function () {
                    setStatus('点击视频继续播放');
                });
            }
        }

        function attachNative() {
            video.src = source;
            attached = true;
            setStatus('正在播放');
            playVideo();
        }

        function attachHls(Hls) {
            if (!Hls || !Hls.isSupported()) {
                attachNative();
                return;
            }
            if (hlsInstance) {
                hlsInstance.destroy();
            }
            hlsInstance = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
            hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
                attached = true;
                setStatus('正在播放');
                playVideo();
            });
            hlsInstance.on(Hls.Events.ERROR, function (event, data) {
                if (data && data.fatal) {
                    setStatus('播放连接中');
                    hlsInstance.destroy();
                    attachNative();
                }
            });
        }

        function startPlayback() {
            if (button) {
                button.classList.add('hidden');
            }
            setStatus('加载播放源');
            if (attached) {
                playVideo();
                return;
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                attachNative();
                return;
            }
            loadHls().then(attachHls).catch(attachNative);
        }

        if (button) {
            button.addEventListener('click', startPlayback);
        }
        player.addEventListener('click', function (event) {
            if (event.target === video) {
                return;
            }
            if (!attached) {
                startPlayback();
            }
        });
        video.addEventListener('play', function () {
            if (button) {
                button.classList.add('hidden');
            }
            setStatus('正在播放');
        });
        video.addEventListener('pause', function () {
            if (!video.ended) {
                setStatus('已暂停');
            }
        });
        video.addEventListener('ended', function () {
            setStatus('播放结束');
        });
    }

    document.querySelectorAll('[data-video-player]').forEach(setupPlayer);
})();
