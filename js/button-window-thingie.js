const buttons = document.querySelectorAll('[data-title]');

buttons.forEach(button => {
    const windowEl = button.closest('.window');
    const titleEl = windowEl.querySelector('.title-bar-text');
    const originalTitle = titleEl.textContent;
    let timeout;
    button.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
        titleEl.textContent = button.dataset.title;
    });
    button.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
            titleEl.textContent = originalTitle;
        }, 2000);
    });
});

const windows = document.querySelectorAll('.window');
windows.forEach(windowEl => {
    const titleEl = windowEl.querySelector('.title-bar-text');
    const originalTitle = titleEl.textContent;

    windowEl.addEventListener('mouseleave', () => {
        titleEl.textContent = originalTitle;
    });
});
