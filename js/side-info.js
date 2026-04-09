function updateTime() {
    const time = new Date().toLocaleTimeString('en-US', {
        timeZone: 'America/Los_Angeles',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    document.getElementById('local-time').textContent = time;
}
updateTime();
setInterval(updateTime, 1000);

function maybeMarquee(el, text, links) {
    if (links) {
        el.innerHTML = links;
    } else {
        el.textContent = text;
    }
    el.style.display = 'inline-block';
    el.style.whiteSpace = 'nowrap';

    requestAnimationFrame(() => {
        const wrap = el.parentElement;
        if (el.scrollWidth > wrap.clientWidth) {
            el.classList.add('marquee-text');
        }
    });
}

fetch('https://status.cafe/users/squirrel/status.json')
    .then(r => r.json())
    .then(d => maybeMarquee(document.getElementById('status-text'), d.content || 'no status'))
    .catch(() => document.getElementById('status-text').textContent = 'unavailable');

fetch('https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=squirre1z&api_key=4204a2d9b89f985f6b47c29f913dd463&format=json&limit=1')
    .then(r => r.json())
    .then(d => {
        const track = d.recenttracks.track[0];
        const nowPlaying = track['@attr']?.nowplaying;
        const icon = document.getElementById('music-icon');
        const artistName = track.artist['#text'];
        const trackName = track.name;
        const trackUrl = track.url;
        const artistUrl = `https://www.last.fm/music/${encodeURIComponent(artistName)}`;

        const html = `<a href="${artistUrl}" target="_blank">${artistName}</a> - <a href="${trackUrl}" target="_blank">${trackName}</a>`;

        if (nowPlaying) {
            icon.classList.add('music-playing');
            icon.classList.remove('music-idle');
        } else {
            icon.classList.add('music-idle');
            icon.classList.remove('music-playing');
        }
        maybeMarquee(document.getElementById('lastfm-text'), null, html);
    })
    .catch(() => {
        document.getElementById('music-icon').classList.add('music-idle');
        document.getElementById('lastfm-text').textContent = 'unavailable';
    });