
// https://nomaakip.xyz/
// squirrel was here,,., hell yeah squirrel made the widget #better!! - hacks.guide
function applyMarquee(el, text) {
    el.classList.remove("marquee");
    el.innerHTML = text;

    if (el.scrollWidth > el.clientWidth) {
        el.classList.add("lastmarquee");
        el.innerHTML = `<span>${text}</span>`;
    }
}

function getRecentTrack() {
    fetch('https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=squirre1z&api_key=07826e86965e2f6721b3bc1f0f2a61d1&format=json&limit=1')
        .then(response => response.json())
        .then(data => {
            const track = data.recenttracks.track[0];
            const imgUrl = track.image[3]["#text"] || "/img/lfm.png";

            const titleEl = document.querySelector(".lfm-info-title");
            const artistEl = document.querySelector(".lfm-info-artist");

            applyMarquee(titleEl, track.name);
            artistEl.textContent = track.artist["#text"];

            document.getElementById("lfm-cover-img").src = imgUrl;
            document.getElementById("lfm-blur-img").src = imgUrl;

            if (track["@attr"] && track["@attr"].nowplaying === "true") {
                document.querySelector(".lfm-footer-status-text").textContent = "Currently Playing";
            } else {
                document.querySelector(".lfm-footer-status-text").textContent = "Recently Played";
            }
        });
}

setInterval(getRecentTrack, 20000);
getRecentTrack();

fetch("assets/site/frames/last-fm.html")
    .then(response => response.text())
    .then(html => {
        document.getElementById("lfm-widget-container").innerHTML = html;
    });
