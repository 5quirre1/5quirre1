fetch('components/gallery/photos.json')
    .then(r => r.json())
    .then(photos => {
        const valid = photos.filter(p => p.src);

        const pick = valid[Math.floor(Math.random() * valid.length)];

        const img = document.getElementById('random-photo');
        img.src = pick.thumb || pick.src;

        const captionEl = document.querySelector('.interests-photo-caption');

        if (pick.caption && pick.caption.trim() !== "") {
            maybeMarquee(captionEl, pick.caption);
        } else {
            maybeMarquee(captionEl, "random photo i took");
        }
    })
    .catch(() => {
        const captionEl = document.querySelector('.interests-photo-caption');
        maybeMarquee(captionEl, "failed to load photo");
    });