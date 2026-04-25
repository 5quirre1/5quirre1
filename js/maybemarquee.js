function maybeMarquee(el, text, links) {
    if (links) {
        el.innerHTML = links;
    } else {
        el.textContent = text;
    }
    el.style.display = 'inline-block';
    el.style.whiteSpace = 'nowrap';

    requestAnimationFrame(() => {
        const wrap = el.parentElement;
        if (el.scrollWidth > wrap.clientWidth) {
            el.classList.add('marquee-text');
        }
    });
}