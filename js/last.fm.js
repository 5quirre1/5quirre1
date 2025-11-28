function applyMarquee(el, text) {
    el.classList.remove("marquee");
    el.textContent = text;
    if (el.scrollWidth > el.clientWidth) {
        el.classList.add("marquee");
        el.innerHTML = `<span>${text}</span>`;
    }
}

async function getRecentTrack() {
    try {
        const res = await fetch('https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=squirre1z&api_key=4204a2d9b89f985f6b47c29f913dd463&format=json&limit=1');
        const data = await res.json();
        const track = data.recenttracks.track[0];
        const imgUrl = track.image[3]["#text"] || "img/lfm.png";

        const titleEl = document.querySelector(".lastfm-info-title");
        const artistEl = document.querySelector(".lastfm-info-artist");
        const coverImg = document.querySelector(".lastfm-cover-img");
        const blurImg = document.querySelector(".lastfm-blur-img");
        const statusEl = document.querySelector(".lastfm-footer-status-text");

        applyMarquee(titleEl, track.name);
        artistEl.textContent = track.artist["#text"];
        coverImg.src = imgUrl;
        blurImg.src = imgUrl;

        statusEl.textContent = track["@attr"] && track["@attr"].nowplaying === "true"
            ? "Currently Playing"
            : "Recently Played";

    } catch (err) {
        console.error("last.FM fetch error:", err);
    }
}

setInterval(getRecentTrack, 20000);
getRecentTrack();

