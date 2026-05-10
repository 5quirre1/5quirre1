const audio = document.getElementById('ambience');
const btn = document.getElementById('volumeBtn');
const icon = document.getElementById('volumeIcon');
let playing = false;

document.addEventListener('click', () => {
    audio.play().then(() => {
        playing = true;
    }).catch(() => { });
}, { once: true });

btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (playing) {
        audio.pause();
        icon.src = '/assets/icons/volume-mute.png';
    } else {
        audio.play();
        icon.src = '/assets/icons/volume-playing.png';
    }
    playing = !playing;
});
