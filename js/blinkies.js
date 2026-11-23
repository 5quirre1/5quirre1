
const blinkies = [
    'transrightsarehumanrights.gif',
    'nerd.gif',
    'dream.gif',
    'groupchat.gif',
    'loveonline.gif',
    '100musical.gif',
    'addicted.gif',
];

const blinkyPath = '/assets/blinkies/';

document.querySelectorAll('.blinkies img').forEach(img => {
    img.style.cursor = 'pointer';

    img.addEventListener('click', () => {
        const used = [...document.querySelectorAll('.blinkies img')]
            .map(other => other.src.split('/').pop());

        const available = blinkies.filter(name => !used.includes(name));

        if (!available.length) return;

        const next = available[Math.floor(Math.random() * available.length)];

        img.src = blinkyPath + next;

        img.classList.remove('bouncing');
        void img.offsetWidth;
        img.classList.add('bouncing');
    });
});
