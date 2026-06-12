document.addEventListener("click", (e) => {
    const img = e.target.closest(".button-share img");
    if (!img) return;

    const textarea = img.parentElement.querySelector("textarea");
    if (!textarea) return;

    if (!img.dataset.originalTip) {
        img.dataset.originalTip = img.dataset.tip;
    }

    img.dataset.tip = "copied!";

    if (active) {
        tooltip.textContent = img.dataset.tip;
    }

    clearTimeout(img._copyTimeout);
    img._copyTimeout = setTimeout(() => {
        img.dataset.tip = img.dataset.originalTip;

        if (active) {
            tooltip.textContent = img.dataset.tip;
        }
    }, 1500);

    navigator.clipboard.writeText(textarea.value)
        .catch(err => console.error("failed to copy", err));
});