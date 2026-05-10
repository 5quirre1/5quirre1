function updateCountdown() {
    const now = new Date();
    let target = new Date(now.getFullYear(), 4, 29);

    if (now > target) {
        target.setFullYear(target.getFullYear() + 1);
    }

    const diff = target - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    document.getElementById("releaseText").textContent =
        `Releasing in ${days} day${days !== 1 ? "s" : ""}.`;
}

updateCountdown();
setInterval(updateCountdown, 3600000);

function initPosterSlider() {
    const content = document.getElementById("posterSlider");
    if (!content) return;

    const size = 254.86;
    const count = content.children.length;

    const forward = [...Array(count).keys()];
    const reverse = [...forward].reverse().slice(1, -1);

    const positions = [...forward, ...reverse, 0];

    const steps = positions.length;

    const slideDuration = 5.2;
    const holdDuration = 2.2;

    const totalDuration = steps * (slideDuration + holdDuration);
    const stepPercent = 100 / steps;
    const ratio = slideDuration / (slideDuration + holdDuration);

    let frames = "";

    positions.forEach((idx, i) => {
        const tx = -(idx * size);

        const start = i * stepPercent;
        const mid = start + ratio * stepPercent;
        const end = (i + 1) * stepPercent;

        frames += `
            ${start.toFixed(4)}% { transform: translateX(${tx}px); }
            ${mid.toFixed(4)}% { transform: translateX(${tx}px); }
        `;

        if (i < steps - 1) {
            frames += `${end.toFixed(4)}% { transform: translateX(${tx}px); }\n`;
        }
    });

    frames += `100% { transform: translateX(0px); }`;

    const style = document.createElement("style");
    style.textContent = `
        @keyframes posterSlide {
            ${frames}
        }

        #posterSlider {
            animation: posterSlide ${totalDuration}s linear infinite;
            will-change: transform;
        }
    `;

    document.head.appendChild(style);
}

document.addEventListener("DOMContentLoaded", initPosterSlider);
