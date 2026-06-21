function initBunchofshitStats() {
    const countdown = document.getElementById("bunchofshit-birthday-countdown");

    if (!countdown) {
        return;
    }

    const raw = countdown.dataset.siteBirthday;
    const [, month, day] = raw.split("-").map(Number);

    function getNextBirthday(now) {
        const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisYear = new Date(now.getFullYear(), month - 1, day);
        return thisYear >= todayMidnight
            ? thisYear
            : new Date(now.getFullYear() + 1, month - 1, day);
    }

    function tick() {
        const now = new Date();
        const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const next = getNextBirthday(now);

        if (next.getTime() === todayMidnight.getTime()) {
            countdown.textContent = "today!!";
            return;
        }

        const msPerDay = 24 * 60 * 60 * 1000;
        const daysLeft = Math.round((next - todayMidnight) / msPerDay);

        countdown.textContent = daysLeft;
    }

    tick();

    if (countdown.dataset.intervalId) {
        clearInterval(Number(countdown.dataset.intervalId));
    }

    const intervalId = setInterval(tick, 60000);
    countdown.dataset.intervalId = String(intervalId);
}

function initBunchofshit() {
    const widget = document.querySelector(".bunchofshit-widget");
    const track = document.querySelector(".bunchofshit-track");

    if (!widget || !track) {
        return;
    }

    initBunchofshitStats();

    const slides = track.querySelectorAll(".bunchofshit-slide");
    const count = slides.length;

    if (count < 2) {
        return;
    }

    const holdMs = 5200;
    const slideMs = 800;
    const stepMs = holdMs + slideMs;

    const forward = Array.from(
        { length: count },
        (_, i) => i
    );

    const back = forward
        .slice(1, -1)
        .reverse();

    const positions =
        count === 2
            ? [0, 1, 0]
            : [...forward, ...back];

    const totalMs = positions.length * stepMs;

    const keyframes = [];

    positions.forEach((index, i) => {
        const holdStart =
            ((i * stepMs) / totalMs) * 100;

        const slideStart =
            ((i * stepMs + holdMs) / totalMs) * 100;

        const nextIndex =
            positions[(i + 1) % positions.length];

        const slideEnd =
            (((i + 1) * stepMs) / totalMs) * 100;

        keyframes.push(
            `${holdStart.toFixed(4)}% {
                transform: translateX(${-(index * 100)}%);
            }`
        );

        keyframes.push(
            `${slideStart.toFixed(4)}% {
                transform: translateX(${-(index * 100)}%);
            }`
        );

        keyframes.push(
            `${slideEnd.toFixed(4)}% {
                transform: translateX(${-(nextIndex * 100)}%);
            }`
        );
    });

    const animationName = "bunchofshit-slide-dyn";

    document.getElementById(animationName)?.remove();

    const style = document.createElement("style");

    style.id = animationName;
    style.textContent = `
        @keyframes ${animationName} {
            ${keyframes.join("\n")}
        }

        .bunchofshit-track {
            animation:
                ${animationName}
                ${totalMs}ms
                linear
                infinite;
        }
    `;

    document.head.appendChild(style);

    widget.addEventListener("mouseenter", () => {
        track.style.animationPlayState = "paused";
    });

    widget.addEventListener("mouseleave", () => {
        track.style.animationPlayState = "running";
    });
}

document.addEventListener(
    "includesLoaded",
    initBunchofshit
);