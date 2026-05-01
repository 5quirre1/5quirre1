const CHUNGUSMEID = '1484384790735093831';

fetch(`https://api.lanyard.rest/v1/users/${CHUNGUSMEID}`)
    .then(r => r.json())
    .then(d => {
        const data = d.data;

        const pfp = document.getElementById('discord-pfp');
        pfp.src = `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png`;

        const nameEl = document.getElementById('discord-name');
        nameEl.textContent = data.discord_user.username;
        nameEl.href = `https://discord.com/users/${data.discord_user.id}`;

        const statusEl = document.getElementById('discord-status');
        //wish told me to do this LMFAO
        if (Math.random() < 0.2) {
            statusEl.textContent = 'ask your mother';
        } else {
            statusEl.textContent =
                data.discord_status === 'offline' ? 'no' : 'yes';
        }

        const customStatus = data.activities?.find(a => a.type === 4);
        const emojiEl = document.getElementById('discord-status-emoji');
        const textEl = document.getElementById('discord-status-text');

        if (customStatus) {
            emojiEl.textContent = customStatus.emoji?.name ?? '';
            textEl.textContent = customStatus.state || '';
            maybeMarquee(textEl, textEl.textContent);
        } else {
            emojiEl.textContent = '';
            textEl.textContent = 'no status';
        }
    })
    .catch(() => {
        document.getElementById('discord-status').textContent = 'unavailable';
        document.getElementById('discord-status-text').textContent = 'unavailable';

        const nameEl = document.getElementById('discord-name');
        nameEl.textContent = 'could not find SHIT';
        nameEl.removeAttribute('href');
    });