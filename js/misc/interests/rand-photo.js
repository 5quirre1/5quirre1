
async function initRandomPhotos() {
    const track = document.querySelector('.interests-photo-track');
    const container = document.querySelector('.interests-photo-viewport');
    const captionEl = document.querySelector('.interests-photo-caption');

    if (!track || !container || track.dataset.initialized) return;

    track.dataset.initialized = '1';

    try {
        const res = await fetch('components/gallery/photos.json');
        if (!res.ok) throw new Error('Failed to load photos');

        const photos = await res.json();
        const valid = photos.filter(p => p.src);

        if (!valid.length) throw new Error('No valid photos');

        valid.sort(() => Math.random() - 0.5);

        const fragment = document.createDocumentFragment();

        valid.forEach(photo => {
            const a = document.createElement('a');
            a.href = photo.src;

            const img = document.createElement('img');
            img.src = photo.thumb || photo.src;
            img.alt = photo.caption || 'A random photo I took';
            img.loading = 'lazy';
            img.decoding = 'async';

            a.appendChild(img);
            fragment.appendChild(a);
        });

        track.replaceChildren(fragment);

        let index = 0;
        const slideDuration = 4.9;
        const holdDuration = 3.1;
        const stepDuration = slideDuration + holdDuration;

        const updateCaption = () => {
            const caption = valid[index].caption?.trim() || 'random photo i took';
            maybeMarquee(captionEl, caption);
        };

        updateCaption();

        if (valid.length < 2) return;

        const stepPercent = 100 / valid.length;
        const ratio = slideDuration / stepDuration;

        const frames = valid.map((_, i) => {
            const start = i * stepPercent;
            const mid = start + ratio * stepPercent;
            const end = (i + 1) * stepPercent;
            const tx = -(i * 100);

            return `
                ${start}% { transform: translate3d(${tx}%, 0, 0); }
                ${mid}% { transform: translate3d(${tx}%, 0, 0); }
                ${end}% { transform: translate3d(${tx - 100}%, 0, 0); }
            `;
        }).join('');

        const styleId = 'random-photos-dynamic';
        document.getElementById(styleId)?.remove();

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            @keyframes randomPhotosSlide {
                ${frames}
            }

            .interests-photo-track {
                animation: randomPhotosSlide ${valid.length * stepDuration}s linear infinite;
                will-change: transform;
            }
        `;

        document.head.appendChild(style);

        let interval;

        const startCaptionInterval = () => {
            clearInterval(interval);

            interval = setInterval(() => {
                index = (index + 1) % valid.length;
                updateCaption();
            }, stepDuration * 1000);
        };

        const stopCaptionInterval = () => {
            clearInterval(interval);
        };

        startCaptionInterval();

        container.addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
            stopCaptionInterval();
        });

        container.addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
            startCaptionInterval();
        });

    } catch (error) {
        console.error(error);
        maybeMarquee(captionEl, 'failed to load photo');
        track.dataset.initialized = '';
    }

    initTooltip();
}

document.addEventListener('includesLoaded', initRandomPhotos);
