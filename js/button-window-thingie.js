const MAX_LENGTH = 20;
//https://vanillamilkshake.neocities.org/ was a super long name LOL thanks bangus or i would jhave never fixed ts
function shorten(text) {
    return text.length <= MAX_LENGTH ? text : text.slice(0, MAX_LENGTH - 1) + "…";
}

const buttons = document.querySelectorAll('[data-title]');
//while i'm at it too i can fix this
buttons.forEach(button => {
    const windowEl = button.closest('.window');
    const titleSpan = windowEl.querySelector('.title-bar-text span#website-text-thingie');
    if (!titleSpan) return;

    const originalTitle = titleSpan.textContent;
    let timeout;

    const isItActuallyHovered = () =>
        [...windowEl.querySelectorAll('[data-title]')].some(b => b.matches(':hover'));

    button.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
        titleSpan.textContent = shorten(button.dataset.title || "");
    });

    button.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
            if (!isItActuallyHovered()) {
                titleSpan.textContent = shorten(originalTitle);
            }
        }, 2000);
    });

    windowEl.addEventListener('mouseleave', () => {
        if (!isItActuallyHovered()) {
            titleSpan.textContent = shorten(originalTitle);
        }
    });
});
