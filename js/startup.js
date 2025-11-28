const overlay = document.getElementById('startup-overlay');
const video = document.getElementById('startup-video');
const audio = new Audio("./media/sfx/startup.mp3");
audio.preload = "auto";
audio.load();

const skipBootscreen = localStorage.getItem('skipBootscreen') === 'true';

if (skipBootscreen) {
    overlay.style.display = 'none';
} else {
    video.muted = true;
    video.play().catch(() => {});

    video.addEventListener('ended', () => {
        audio.currentTime = 0;
        audio.play().catch(() => {});

        overlay.style.opacity = "0";
        setTimeout(() => {
            overlay.remove();
        }, 600);
    });
}
