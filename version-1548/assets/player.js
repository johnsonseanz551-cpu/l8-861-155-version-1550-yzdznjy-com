
import { H as Hls } from './hls-vendor-dru42stk.js';

function setupPlayer(player) {
    var video = player.querySelector('video');
    var overlay = player.querySelector('.player-overlay');
    var streamUrl = player.dataset.streamUrl;
    var started = false;
    var hls = null;

    if (!video || !streamUrl) {
        return;
    }

    function hideOverlay() {
        if (overlay) {
            overlay.classList.add('is-hidden');
        }
    }

    function showOverlay() {
        if (overlay) {
            overlay.classList.remove('is-hidden');
        }
    }

    function playVideo() {
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                showOverlay();
            });
        }
    }

    function start() {
        if (started) {
            hideOverlay();
            playVideo();
            return;
        }

        started = true;
        video.setAttribute('controls', 'controls');

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = streamUrl;
            video.addEventListener('loadedmetadata', playVideo, { once: true });
            hideOverlay();
            video.load();
            return;
        }

        if (Hls && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                hideOverlay();
                playVideo();
            });
            hls.on(Hls.Events.ERROR, function (_event, data) {
                if (data && data.fatal) {
                    showOverlay();
                }
            });
            return;
        }

        video.src = streamUrl;
        hideOverlay();
        video.load();
        playVideo();
    }

    if (overlay) {
        overlay.addEventListener('click', start);
    }

    video.addEventListener('click', function () {
        if (!started) {
            start();
        }
    });

    window.addEventListener('beforeunload', function () {
        if (hls) {
            hls.destroy();
        }
    });
}

document.querySelectorAll('.js-player').forEach(setupPlayer);
