const buttons = document.querySelectorAll('[data-title]');

buttons.forEach(button => {
    const windowEl = button.closest('.window');
    const titleSpan = windowEl.querySelector('.title-bar-text span#website-text-thingie');
    if (!titleSpan) return;

    const originalTitle = titleSpan.textContent;
    let timeout;

    button.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
        titleSpan.textContent = button.dataset.title;
    });

    button.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
            titleSpan.textContent = originalTitle;
        }, 2000);
    });
});

const windows = document.querySelectorAll('.window');
windows.forEach(windowEl => {
    const titleSpan = windowEl.querySelector('.title-bar-text span#website-text-thingie');
    if (!titleSpan) return;
    const originalTitle = titleSpan.textContent;

    windowEl.addEventListener('mouseleave', () => {
        titleSpan.textContent = originalTitle;
    });
});
