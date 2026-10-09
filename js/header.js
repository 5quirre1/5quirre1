(function () {
    function initHeaderTextStuff() {
        const colors = [
            '#FF7518',
            '#000000',
            '#6A0DAD',
            '#32CD32'
        ];

        document.querySelectorAll('.website-name-shit').forEach(el => {
            if (el.dataset.initHeaderTextStuff) return;
            el.dataset.initHeaderTextStuff = '1';

            const italic = el.querySelector('i');
            if (!italic) return;

            const text = italic.textContent;
            italic.textContent = '';

            for (let i = 0; i < text.length; i++) {
                const span = document.createElement('span');
                span.className = 'letter';
                span.textContent = text[i];
                span.style.setProperty('--i', i);
                span.style.color = colors[i % colors.length];
                span.style.webkitTextFillColor = colors[i % colors.length];
                italic.appendChild(span);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeaderTextStuff);
    } else {
        initHeaderTextStuff();
    }

    document.addEventListener('includesLoaded', initHeaderTextStuff);
    if (window.includesReady) initHeaderTextStuff();
})();