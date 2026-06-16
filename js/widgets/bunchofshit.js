function initBunchofshit() {
    const widget = document.querySelector('.bunchofshit-widget');
    const track = document.querySelector('.bunchofshit-track');
    if (!widget || !track) return;

    const slides = track.querySelectorAll('.bunchofshit-slide');
    const count = slides.length;
    if (count < 2) return;

    const holdMs = 5200;
    const slideMs = 800;
    const stepMs = holdMs + slideMs;

    const forward = Array.from({ length: count }, (_, i) => i);
    const back = forward.slice(1, -1).reverse();
    const positions = count === 2 ? [0, 1, 0] : [...forward, ...back];

    const totalMs = positions.length * stepMs;

    const kf = [];
    positions.forEach((idx, i) => {
        const holdStart = (i * stepMs) / totalMs * 100;
        const slideStart = (i * stepMs + holdMs) / totalMs * 100;
        const nextIdx = positions[Q(i + 1) % positions.length];
        kf.push(`${holdStart.toFixed(4)}% { transform: translateX(${-(idx * 100)}%); }`);
        kf.push(`${slideStart.toFixed(4)}% { transform: translateX(${-(idx * 100)}%); }`);
        const slideEnd = ((i + 1) * stepMs) / totalMs * 100;
        kf.push(`${slideEnd.toFixed(4)}% { transform: translateX(${-(nextIdx * 100)}%); }`);
    });

    const animName = 'bunchofshit-slide-dyn';
    document.getElementById(animName)?.remove();

    const style = document.createElement('style');
    style.id = animName;
    style.textContent = `
        @keyframes ${animName} {
            ${kf.join('\n            ')}
        }
        .bunchofshit-track {
            animation: ${animName} ${totalMs}ms linear infinite;
        }
    `;
    document.head.appendChild(style);

    widget.addEventListener('mouseenter', () => {
        track.style.animationPlayState = 'paused';
    });
    widget.addEventListener('mouseleave', () => {
        track.style.animationPlayState = 'running';
    });
}

document.addEventListener('includesLoaded', initBunchofshit);