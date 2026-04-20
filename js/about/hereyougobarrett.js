//👀👀👀👀👀👀👀👀👀👀
let slendyClicks = 0;
let slendyLocked = false;
const slendyEl = document.getElementById('LMFAO');

if (slendyEl) {
    slendyEl.addEventListener('click', () => {
        if (slendyLocked) return;
        slendyClicks++;

        if (slendyClicks >= 10) {
            slendyLocked = true;
            slendyEl.classList.add('slendycuck-fade-out');

            setTimeout(() => {
                slendyEl.textContent = 'dummy thick guardian 👀👀';
                void slendyEl.offsetWidth;
                slendyEl.classList.remove('slendycuck-fade-out');
            }, 400);

            setTimeout(() => {
                slendyEl.classList.add('slendycuck-fade-out');

                setTimeout(() => {
                    slendyEl.textContent = 'slendytubbies';
                    void slendyEl.offsetWidth;
                    slendyEl.classList.remove('slendycuck-fade-out');
                    slendyClicks = 0;
                    slendyLocked = false;
                }, 400);
            }, 5400);
        }
    });
}