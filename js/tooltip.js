let tooltip = null;
let active = false;

function initTooltip() {
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        document.body.appendChild(tooltip);
    }

    document.querySelectorAll('[data-tip]').forEach(el => {
        if (el.dataset.tooltipBound) return;
        el.dataset.tooltipBound = "1";

        el.addEventListener('mouseenter', e => {
            tooltip.textContent = el.dataset.tip;
            active = true;
            moveTooltip(e);
            setTimeout(() => {
                if (active) tooltip.style.opacity = 1;
            }, 50);
        });

        el.addEventListener('mousemove', moveTooltip);
        el.addEventListener('mouseleave', () => {
            active = false;
            tooltip.style.opacity = 0;
        });
    });
}

function moveTooltip(e) {
    const padding = 12;

    const rect = tooltip.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let x = e.clientX + padding;
    let y = e.clientY + padding;

    if (x + rect.width > vw) x = e.clientX - rect.width - padding;
    if (y + rect.height > vh) y = e.clientY - rect.height - padding;

    if (x < padding) x = padding;
    if (y < padding) y = padding;

    tooltip.style.left = x + window.scrollX + 'px';
    tooltip.style.top = y + window.scrollY + 'px';
}

document.addEventListener('DOMContentLoaded', initTooltip);
document.addEventListener('includesLoaded', initTooltip);
