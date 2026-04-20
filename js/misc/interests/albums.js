function initAmazingAlbumsShit() {
    const content = document.querySelector('.amazing-albums-content');
    const container = document.querySelector('.amazing-albums');

    if (!content || !container) return;

    const links = Array.from(content.children);
    if (links.length < 2) return;

    const shuffled = [...links].sort(() => Math.random() - 0.5);
    content.replaceChildren(...shuffled);

    const size = 150;
    const count = links.length;
    const animName = 'album-alternate-dyn';
    document.getElementById(animName)?.remove();
    
    const forward = [...Array(count).keys()];
    const reverse = [...forward].reverse().slice(1, -1);
    const positions = [...forward, ...reverse];

    const steps = positions.length;

    const slideDuration = 5.2;
    const holdDuration = 2.2;

    const totalDuration = steps * (slideDuration + holdDuration);
    const stepPercent = 100 / steps;
    const ratio = slideDuration / (slideDuration + holdDuration);

    let frames = '';

    positions.forEach((idx, i) => {
        const tx = -(idx * size);

        const start = i * stepPercent;
        const mid = start + ratio * stepPercent;
        const end = (i + 1) * stepPercent;

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