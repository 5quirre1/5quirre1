const startTime = performance.now();
document.addEventListener('DOMContentLoaded', function () {
    const loadTime = performance.now() - startTime;
    const loadTimeWidget = document.getElementById('load-time-widget');
    const loadTimeValue = document.getElementById('load-time-value');
    if (loadTime >= 0) {
        loadTimeValue.textContent = loadTime.toFixed(2);
    } else {
        loadTimeValue.textContent = 'N/A';
    }

    setTimeout(() => {
        loadTimeWidget.classList.add('show');
    }, 100);

    setTimeout(() => {
        loadTimeWidget.classList.remove('show');
        loadTimeWidget.classList.add('hide');
    }, 3000);
});
