const buttons = document.querySelectorAll('[data-title]');

buttons.forEach(button => {
    const windowEl = button.closest('.window');
    const titleEl = windowEl.querySelector('.title-bar-text');
    const originalTitle = titleEl.textContent;
    button.addEventListener('mouseenter', () => {
        titleEl.textContent = button.dataset.title;
    });
    button.addEventListener('mouseleave', () => {
        titleEl.textContent = originalTitle;
    });
});