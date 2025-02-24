function updateLastFmWidget() {
    const apiKey = "4204a2d9b89f985f6b47c29f913dd463";
    const username = "Squirre1Z";
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data.recenttracks || !data.recenttracks.track || data.recenttracks.track.length === 0) {
                throw new Error("No recent tracks found");
            }

            const track = data.recenttracks.track[0];
            const isPlaying = track['@attr'] && track['@attr'].nowplaying;

            document.getElementById('lastfm-widget').onclick = () => window.open(track.url, '_blank');

            document.getElementById('lastfm-status-icon').style.display = isPlaying ? 'inline' : 'none';
            document.getElementById('lastfm-status-text').textContent = isPlaying ? 'Scrobbling Now' : 'Recently Played';

            const albumCover = track.image[3]['#text'] || "https://graybox.lol/img/lastfm/lastfm-album-placeholder.jpg";
            document.getElementById('lastfm-cover').src = albumCover;
            document.getElementById('lastfm-track').textContent = track.name;
            document.getElementById('lastfm-artist').textContent = track.artist['#text'];
        })
        .catch(error => {
            console.error("Error fetching Last.FM data:", error);
            document.getElementById('lastfm-status-text').textContent = "Error fetching data";
        });
}

setInterval(updateLastFmWidget, 30000);
updateLastFmWidget();