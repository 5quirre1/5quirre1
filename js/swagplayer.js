let swagSongs = [];
let swagIndex = 0;

const swagAudio = document.getElementById("swag-audio");
const swagVolume = document.getElementById("swag-volume");
const swagVolumeDisplay = document.getElementById("swag-volume-display");
const swagText = document.getElementById("swag-marquee");
const swagBtnPlay = document.getElementById("swag-play");
const swagBtnNext = document.getElementById("swag-next");
const swagBtnBack = document.getElementById("swag-back");
const swagProgress = document.getElementById("swag-progress").querySelector("div");
const swagTimeCurrent = document.getElementById("swag-time-current");
const swagTimeTotal = document.getElementById("swag-time-total");

fetch('songs.json')
    .then(r => r.json())
    .then(data => {
        swagSongs = data;
        swagLoadSong(swagIndex);
        updateVolumeDisplay();
    });

function swagLoadSong(i) {
    if (!swagSongs.length) return;
    const s = swagSongs[i];
    swagAudio.src = s.file;
    swagText.textContent = `Now Playing: ${s.title} - ${s.artist}`;
}

function swagFormatTime(s) {
    if (isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}

function updateVolumeDisplay() {
    swagVolumeDisplay.textContent = `${Math.round(swagAudio.volume * 100)}%`;
}

swagVolume.addEventListener("input", () => { swagAudio.volume = swagVolume.value; updateVolumeDisplay() });
swagBtnPlay.addEventListener("click", () => {
    if (swagAudio.paused) { swagAudio.play(); swagBtnPlay.src = "img/swagplayer/stop.png"; swagText.style.animationPlayState = "running" }
    else { swagAudio.pause(); swagBtnPlay.src = "img/swagplayer/play.png"; swagText.style.animationPlayState = "paused" }
});
swagBtnNext.addEventListener("click", () => {
    if (!swagSongs.length) return;
    swagIndex = (swagIndex + 1) % swagSongs.length;
    swagLoadSong(swagIndex);
    swagAudio.play();
    swagBtnPlay.src = "img/swagplayer/stop.png";
    swagText.style.animationPlayState = "running";
});
swagBtnBack.addEventListener("click", () => {
    if (!swagSongs.length) return;
    swagIndex = (swagIndex - 1 + swagSongs.length) % swagSongs.length;
    swagLoadSong(swagIndex);
    swagAudio.play();
    swagBtnPlay.src = "img/swagplayer/stop.png";
    swagText.style.animationPlayState = "running";
});
swagAudio.addEventListener("ended", () => {
    if (!swagSongs.length) return;
    swagIndex = (swagIndex + 1) % swagSongs.length;
    swagLoadSong(swagIndex);
    swagAudio.play();
    swagText.style.animationPlayState = "running";
});
swagAudio.addEventListener("loadedmetadata", () => {
    swagTimeTotal.textContent = swagFormatTime(swagAudio.duration);
    swagAudio.volume = swagVolume.value;
    updateVolumeDisplay();
});
swagAudio.addEventListener("timeupdate", () => {
    swagTimeCurrent.textContent = swagFormatTime(swagAudio.currentTime);
    swagProgress.style.width = `${(swagAudio.currentTime / swagAudio.duration) * 100}%`;
});
document.getElementById("swag-progress").addEventListener("click", e => {
    const rect = e.currentTarget.getBoundingClientRect();
    swagAudio.currentTime = (e.clientX - rect.left) / rect.width * swagAudio.duration;
});
