const CHUNGUSMEID = '1527660023420031069';

fetch(`https://api.lanyard.rest/v1/users/${CHUNGUSMEID}`)
    .then(r => r.json())
    .then(d => {
        const data = d.data;

        const pfp = document.getElementById('discord-pfp');
        pfp.src = `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png`;

        const nameEl = document.getElementById('discord-name');
        nameEl.textContent = data.discord_user.username;
        nameEl.href = `https://discord.com/users/${data.discord_user.id}`;

        const statusIcon = document.querySelector('#discord-status-icon img');
        const discordStatus = data.discord_status || 'offline';

        const statusIcons = {
            online: 'status-online.png',
            idle: 'status-away.png',
            dnd: 'status-busy.png',
            offline: 'status-offline.png'
        };

        statusIcon.src = `/assets/icons/${statusIcons[discordStatus]}`;
        statusIcon.alt = discordStatus;
        statusIcon.title = discordStatus === 'dnd'
            ? 'Do Not Disturb'
            : discordStatus.charAt(0).toUpperCase() + discordStatus.slice(1);

        const customStatus = data.activities?.find(a => a.type === 4);
        const emojiEl = document.getElementById('discord-status-emoji');
        const textEl = document.getElementById('discord-status-text');

        if (customStatus) {
            textEl.textContent = customStatus.state || '';

            if (customStatus.emoji?.name) {
                emojiEl.textContent = customStatus.emoji.name;
            } else {
                emojiEl.innerHTML = '<img src="/assets/icons/status.png" alt="status">';
            }

            maybeMarquee(textEl, textEl.textContent);
        } else {
            textEl.textContent = 'no status';
            emojiEl.innerHTML = '<img src="/assets/icons/status.png" alt="status">';
        }
    })
    .catch(() => {
        const statusIcon = document.querySelector('#discord-status-icon img');
        statusIcon.src = '/assets/icons/status-offline.png';
        statusIcon.alt = 'offline';
        statusIcon.title = 'Offline';

        document.getElementById('discord-status-text').textContent = 'unavailable';
        document.getElementById('discord-status-emoji').innerHTML =
            '<img src="/assets/icons/status.png" alt="status">';

        const nameEl = document.getElementById('discord-name');
        nameEl.textContent = 'could not find SHIT';
        nameEl.removeAttribute('href');
    });

let evilAssCountryTaps = 0;
let wokeTAKEOVER = false;
const nationalityCard = document.getElementById('nationality-card');
const nationalityImage = document.getElementById('nationality-image');

const wokeImage = new Image();
wokeImage.src = '/assets/about/WOKE.png';

const usaImage = new Image();
usaImage.src = '/assets/about/usa.png';

if (nationalityCard && nationalityImage) {
    nationalityCard.addEventListener('click', () => {
        if (wokeTAKEOVER) return;
        evilAssCountryTaps++;

        if (evilAssCountryTaps >= 10) {
            wokeTAKEOVER = true;
            nationalityImage.classList.add('fading');

            setTimeout(() => {
                nationalityImage.src = wokeImage.src;
                nationalityImage.alt = 'WOKE';
                void nationalityImage.offsetWidth;
                nationalityImage.classList.remove('fading');
            }, 400);

            setTimeout(() => {
                nationalityImage.classList.add('fading');

                setTimeout(() => {
                    nationalityImage.src = usaImage.src;
                    nationalityImage.alt = 'USA';
                    void nationalityImage.offsetWidth;
                    nationalityImage.classList.remove('fading');
                    evilAssCountryTaps = 0;
                    wokeTAKEOVER = false;
                }, 400);
            }, 3400);
        }
    });
}

const birthday = new Date(2011, 10, 15, 0, 0, 0);
const ageEl = document.getElementById('age');

const yearLength = 365.2425 * 24 * 60 * 60 * 1000;

function updateAge() {
    const now = Date.now();
    const age = (now - birthday.getTime()) / yearLength;

    ageEl.textContent = age.toFixed(10);

    requestAnimationFrame(updateAge);
}

updateAge();