const icon = document.getElementById('flip-icon');
const spans = document.querySelectorAll('.colored');

let flipped = false;

icon.addEventListener('click', (e) => {
    e.stopPropagation();
    flipped = !flipped;

    spans.forEach((span, i) => {
        setTimeout(() => {
            span.style.color = flipped ? '' : span.dataset.originalColor;
            span.classList.add('animated');
            setTimeout(() => span.classList.remove('animated'), 200);
        }, i * 50);
    });

    icon.src = flipped
        ? 'assets/icons/color-text.png'
        : 'assets/icons/color-text-remove.png';
});
