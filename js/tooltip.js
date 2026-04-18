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
    tooltip.style.left = (window.scrollX + e.clientX + 14) + 'px';
    tooltip.style.top  = (window.scrollY + e.clientY + 14) + 'px';
}

document.addEventListener('DOMContentLoaded', initTooltip);
document.addEventListener('includesLoaded', initTooltip);