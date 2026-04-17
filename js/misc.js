(function () {
    const trigger = document.getElementById('miscTrigger');
    const dropdown = document.getElementById('miscDropdown');

    if (!trigger || !dropdown) return;

    function openDropdown() {
        dropdown.style.display = 'block';

        requestAnimationFrame(() => {
            dropdown.classList.add('open');
            dropdown.style.maxHeight = dropdown.scrollHeight + 'px';
            dropdown.style.opacity = '1';
        });
    }

    function closeDropdown() {
        dropdown.style.maxHeight = '0';
        dropdown.style.opacity = '0';
        dropdown.classList.remove('open');

        dropdown.addEventListener(
            'transitionend',
            () => {
                if (!dropdown.classList.contains('open')) {
                    dropdown.style.display = 'none';
                }
            },
            { once: true }
        );
    }

    function toggle(e) {
        e.preventDefault();

        if (dropdown.classList.contains('open')) {
            closeDropdown();
        } else {
            openDropdown();
        }
    }

    trigger.addEventListener('click', toggle);

    document.addEventListener('click', (e) => {
        const clickedInside =
            trigger.contains(e.target) || dropdown.contains(e.target);

        if (!clickedInside && dropdown.classList.contains('open')) {
            closeDropdown();
        }
    });

    dropdown.style.display = 'none';
    dropdown.style.maxHeight = '0';
    dropdown.style.opacity = '0';
})();
