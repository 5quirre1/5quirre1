function updateTime() {
    const now = new Date();

    const laFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Los_Angeles',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZoneName: 'short'
    });

    const parts = laFormatter.formatToParts(now);

    let timeStr = "";
    let tzName = "";

    for (const p of parts) {
        if (p.type !== "timeZoneName") {
            timeStr += p.value;
        } else {
            tzName = p.value;
        }
    }

    const laTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
    const localTime = new Date();

    const diffMs = laTime - localTime;
    const diffHours = diffMs / (1000 * 60 * 60);

    let diffText = "";

    if (Math.abs(diffHours) < 0.1) {
        diffText = "you have the same timezone!!";
    } else {
        const rounded = Math.round(diffHours);
        if (rounded > 0) {
            diffText = `${rounded}h ahead of you`;
        } else {
            diffText = `${Math.abs(rounded)}h behind you`;
        }
    }

    document.getElementById('local-time-main').textContent = `${timeStr} ${tzName}`;
    maybeMarquee(document.getElementById('local-time-extra'), diffText);
}

updateTime();
setInterval(updateTime, 1000);

function fetchStats() {
    fetch('https://sc.squirrelz.xyz/api/v1/stats?key=squirrel')
        .then(r => r.json())
        .then(d => {
            document.getElementById('stat-visits').textContent = d.total_visits ?? '-';
            document.getElementById('stat-unique').textContent = d.unique_visitors ?? '-';
            document.getElementById('stat-online').textContent = d.on_site ?? '-';
        })
        .catch(() => {
            ['stat-visits', 'stat-unique', 'stat-online'].forEach(id => {
                document.getElementById(id).textContent = '-';
            });
        });
}
fetchStats();
setInterval(fetchStats, 30000);

function linksOnly(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;

    temp.querySelectorAll('*').forEach(node => {
        if (node.tagName !== 'A') {
            node.replaceWith(document.createTextNode(node.textContent));
        } else {
            const href = node.getAttribute('href') || '';
            if (!href.startsWith('http://') && !href.startsWith('https://')) {
                node.removeAttribute('href');
            }
            node.setAttribute('target', '_blank');
            node.setAttribute('rel', 'noopener noreferrer');
        }
    });

    return temp.innerHTML;
}
fetch('https://status.cafe/users/squirrel/status.json')
    .then(r => r.json())
    .then(d => {
        const el = document.getElementById('status-text');
        const content = d.content || 'no status';

        maybeMarquee(el, null, linksOnly(content));
    })
    .catch(() => {
        document.getElementById('status-text').textContent = 'unavailable';
    });

function fetchLastFm() {
    fetch('https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=squirre1z&api_key=4204a2d9b89f985f6b47c29f913dd463&format=json&limit=1')
        .then(r => r.json())
        .then(d => {
            const track = d.recenttracks.track[0];
            const nowPlaying = track['@attr']?.nowplaying;

            const icon = document.getElementById('music-icon');
            const cover = document.getElementById('lastfm-cover');
            const coverLink = document.getElementById('lastfm-cover-link');

            const artistName = track.artist['#text'];
            const trackName = track.name;
            const trackUrl = track.url;
            const artistUrl = `https://www.last.fm/music/${encodeURIComponent(artistName)}`;

            const html = `<a href="${artistUrl}" target="_blank">${artistName}</a> - <a href="${trackUrl}" target="_blank">${trackName}</a>`;

            const imageUrl =
                track.image?.find(img => img.size === 'medium')?.['#text'] ||
                track.image?.find(img => img['#text'])?.['#text'];

            if (imageUrl) {
                cover.src = imageUrl;
            }

            const albumName = track.album?.['#text'];

            if (albumName) {
                coverLink.href = `https://www.last.fm/music/${encodeURIComponent(artistName)}/${encodeURIComponent(albumName)}`;
            } else {
                coverLink.href = trackUrl;
            }

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
}

fetchLastFm();
setInterval(fetchLastFm, 30000);