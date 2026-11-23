
function initButtonMarquee() {
    const container = document.getElementById('button-marquee');
    const track = container?.querySelector('.buttons-track');
    const original = document.getElementById('buttons-original');

    if (!container || !track || !original || track.dataset.initialized) return;

    track.dataset.initialized = 'true';

    const clone = original.cloneNode(true);
    clone.removeAttribute('id');
    clone.setAttribute('aria-hidden', 'true');

    clone.querySelectorAll('a').forEach((a, i) => {
        a.tabIndex = -1;

        const originalLink = original.querySelectorAll('a')[i];

        if (originalLink?.dataset.tip) {
            a.dataset.tip = originalLink.dataset.tip;
        }
    });

    track.appendChild(clone);

    let offset = 0;
    let speed = 35;
    let targetSpeed = 35;
    let groupWidth = 0;
    let lastTime = 0;

    const normalSpeed = 35;
    const hoverSpeed = 8;
    const easing = 0.003;

    function updateWidth() {
        groupWidth = original.getBoundingClientRect().width;

        if (groupWidth > 0) {
            offset %= groupWidth;
        }
    }

    new ResizeObserver(updateWidth).observe(original);
    updateWidth();

    container.addEventListener('pointerenter', () => {
        targetSpeed = hoverSpeed;
    });

    container.addEventListener('pointerleave', () => {
        targetSpeed = normalSpeed;
    });

    function animate(time) {
        if (!lastTime) lastTime = time;

        const delta = Math.min(time - lastTime, 50);
        lastTime = time;

        const factor = 1 - Math.exp(-easing * delta);
        speed += (targetSpeed - speed) * factor;

        if (groupWidth > 0) {
            offset = (offset + speed * delta / 1000) % groupWidth;
            track.style.transform = `translate3d(${-offset}px, 0, 0)`;
        }

        requestAnimationFrame(animate);
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        requestAnimationFrame(animate);
    }
}

function startButtonMarquee() {
    initButtonMarquee();
}

if (window.includesReady) {
    startButtonMarquee();
} else {
    document.addEventListener('includesLoaded', startButtonMarquee, { once: true });
}
