async function loadAlbums() {
    const res = await fetch('/misc/components/interests/albums.json');
    if (!res.ok) throw new Error('Failed to load albums JSON');
    return res.json();
}

function renderAlbums(albums, content) {
    const fragment = document.createDocumentFragment();

    for (const album of albums) {
        const a = document.createElement('a');
        a.href = album.href;
        a.dataset.tip = album.tip;

        const img = document.createElement('img');
        img.src = album.thumb || album.img;
        img.width = 150;
        img.height = 150;
        img.loading = 'lazy';
        img.decoding = 'async';

        a.appendChild(img);
        fragment.appendChild(a);
    }

    content.replaceChildren(fragment);
}

async function initAmazingAlbumsShit() {
    const content = document.querySelector('.amazing-albums-content');
    const container = document.querySelector('.amazing-albums');

    if (!content || !container) return;

    const albums = await loadAlbums();

    albums.sort(() => Math.random() - 0.5);

    renderAlbums(albums, content);

    const count = albums.length;
    if (count < 2) return;

    const size = 150;
    const animName = 'album-alternate-dyn';

    document.getElementById(animName)?.remove();

    const forward = Array.from({ length: count }, (_, i) => i);
    const positions = [...forward, ...forward.slice(1, -1).reverse()];

    const slideDuration = 5.2;
    const holdDuration = 2.2;
    const stepDuration = slideDuration + holdDuration;

    const totalDuration = positions.length * stepDuration;
    const stepPercent = 100 / positions.length;
    const ratio = slideDuration / stepDuration;

    const frames = positions.map((idx, i) => {
        const tx = -(idx * size);
        const start = i * stepPercent;
        const mid = start + ratio * stepPercent;
        const end = (i + 1) * stepPercent;

        return `
            ${start}% { transform: translate3d(${tx}px,0,0); }
            ${mid}% { transform: translate3d(${tx}px,0,0); }
            ${end}% { transform: translate3d(${tx}px,0,0); }
        `;
    }).join('');

    const style = document.createElement('style');
    style.id = animName;
    style.textContent = `
        @keyframes ${animName} {
            ${frames}
        }

        .amazing-albums-content {
            animation: ${animName} ${totalDuration}s linear infinite;
            will-change: transform;
            transform: translateZ(0);
        }
    `;

    document.head.appendChild(style);

    container.addEventListener('mouseenter', () => {
        content.style.animationPlayState = 'paused';
    });

    container.addEventListener('mouseleave', () => {
        content.style.animationPlayState = 'running';
    });

    initTooltip();
}

document.addEventListener('includesLoaded', initAmazingAlbumsShit);