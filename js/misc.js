document.addEventListener("includesLoaded", () => {
    const trigger = document.getElementById("miscTrigger");
    const dropdown = document.getElementById("miscDropdown");

    if (!trigger || !dropdown) return;

    let isOpen = false;

    const open = () => {
        dropdown.style.display = "block";

        requestAnimationFrame(() => {
            dropdown.classList.add("open");
            dropdown.style.maxHeight = dropdown.scrollHeight + "px";
            dropdown.style.opacity = "1";
        });

        isOpen = true;
    };

    const close = () => {
        dropdown.style.maxHeight = "0";
        dropdown.style.opacity = "0";
        dropdown.classList.remove("open");

        dropdown.addEventListener(
            "transitionend",
            () => {
                if (!isOpen) dropdown.style.display = "none";
            },
            { once: true }
        );

        isOpen = false;
    };

    trigger.addEventListener("click", (e) => {
        e.preventDefault();
        isOpen ? close() : open();
    });

    document.addEventListener("click", (e) => {
        if (
            isOpen &&
            !trigger.contains(e.target) &&
            !dropdown.contains(e.target)
        ) {
            close();
        }
    });

    dropdown.style.display = "none";
    dropdown.style.maxHeight = "0";
    dropdown.style.opacity = "0";
});