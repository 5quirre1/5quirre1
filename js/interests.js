function initAmazingAlbumsShit() {
    const content = document.querySelector('.amazing-albums-content');
    const container = document.querySelector('.amazing-albums');
    if (!content || !container) return;

    const imgs = Array.from(content.querySelectorAll('img'));
    const count = imgs.length;
    if (count < 2) return;

    const size = 150;
    const animName = 'album-alternate-dyn';

    const existing = document.getElementById(animName);
    if (existing) existing.remove();

    const positions = [];
    for (let i = 0; i < count; i++) positions.push(i);
    for (let i = count - 2; i >= 0; i--) positions.push(i);

    const steps = positions.length;

    const slideDuration = 5.2;
    const holdDuration = 2.2;

    const totalDuration = steps * (slideDuration + holdDuration);

    let frames = '';

    positions.forEach((idx, i) => {
        const tx = -(idx * size);

        const start = (i / steps) * 100;
        const mid = start + (slideDuration / (slideDuration + holdDuration)) * (100 / steps);
        const end = ((i + 1) / steps) * 100;

        frames += `
            ${start}% { transform: translateX(${tx}px); }
            ${mid}% { transform: translateX(${tx}px); }
            ${end}% { transform: translateX(${tx}px); }
        `;
    });

    const style = document.createElement('style');
    style.id = animName;
    style.textContent = `
        @keyframes ${animName} {
            ${frames}
        }

        .amazing-albums-content {
            animation: ${animName} ${totalDuration}s linear infinite;
            will-change: transform;
        }
    `;

    document.head.appendChild(style);

    container.addEventListener('mouseenter', () => {
        content.style.animationPlayState = 'paused';
    });

    container.addEventListener('mouseleave', () => {
        content.style.animationPlayState = 'running';
    });
}

document.addEventListener('includesLoaded', initAmazingAlbumsShit);