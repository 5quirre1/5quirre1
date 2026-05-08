const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx4aTQ2epOi_afXIRjU54SALrEvZh0aZvJ2LPsggaURhAMLgcg-tJEr4Ag3rGazEUkw/exec';
const SITE_KEY = '0x4AAAAAADIp1p2xoPO0lVSa';

const listEl = document.getElementById('gb-list');
const loadingEl = document.getElementById('gb-loading');
const statCount = document.getElementById('gb-stat-count');
const statLabel = document.getElementById('gb-stat-label');
const submitBtn = document.getElementById('gb-submit');
const statusEl = document.getElementById('gb-status');
const colorInput = document.getElementById('gb-color-input');
const colorPreview = document.getElementById('gb-color-preview');

let turnstileWidget = null;
let clientIp = 'unknown';

(async function () {
    try {
        clientIp = (await fetch('https://api64.ipify.org').then(r => r.text())).trim();
    } catch {
        clientIp = 'unknown';
    }
})();

colorInput.addEventListener('input', () => colorPreview.style.background = colorInput.value);
colorPreview.addEventListener('click', () => colorInput.click());

document.addEventListener('includesLoaded', () => {
    const container = document.getElementById('gb-turnstile');
    if (!container || !window.turnstile) return;
    turnstileWidget = turnstile.render(container, {
        sitekey: SITE_KEY,
        theme: 'light',
        size: 'normal'
    });
});

function fmt(iso) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return `${d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}, ` +
        `${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
}

function escHtml(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function safeColor(c) {
    return /^#[0-9a-fA-F]{6}$/.test(c) ? c : '#3D3D3D';
}

function cleanUrl(url) {
    if (!url) return null;
    try {
        const u = new URL(url.startsWith('http') ? url : 'https://' + url);
        return (u.protocol === 'http:' || u.protocol === 'https:') ? u.href : null;
    } catch { return null; }
}

const PINNED_DATE = '2026-05-07T23:03:00';
document.getElementById('gb-pinned-date').textContent = fmt(new Date(PINNED_DATE));

function buildPost(p) {
    const post = document.createElement('div');
    post.className = 'gb-post gb-dynamic';

    const color = safeColor(p.color);
    const href = cleanUrl(p.site);
    const siteDisplay = href ? href.replace(/^https?:\/\//, '').replace(/\/$/, '') : '';

    const nameEl = document.createElement('span');
    nameEl.className = 'gb-post-name';
    nameEl.style.color = color;

    if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'gb-post-name';
        a.style.cssText = `color:${color};text-decoration:none;`;

        const nameSpan = document.createElement('span');
        nameSpan.textContent = p.name;

        const urlSpan = document.createElement('span');
        urlSpan.className = 'gb-name-url';
        urlSpan.style.color = color;
        urlSpan.textContent = siteDisplay;

        a.append(nameSpan, urlSpan);
        nameEl.replaceWith(a);

        post.innerHTML = '';
        const header = document.createElement('div');
        header.className = 'gb-post-header';
        header.append(a);

        const dateSpan = document.createElement('span');
        dateSpan.className = 'gb-post-date';
        dateSpan.textContent = fmt(new Date(p.date));

        header.appendChild(dateSpan);

        const msgDiv = document.createElement('div');
        msgDiv.className = 'gb-post-message';
        msgDiv.textContent = p.message;

        post.append(header, msgDiv);
    } else {
        const header = document.createElement('div');
        header.className = 'gb-post-header';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'gb-post-name';
        nameSpan.style.color = color;
        nameSpan.textContent = p.name;

        const dateSpan = document.createElement('span');
        dateSpan.className = 'gb-post-date';
        dateSpan.textContent = fmt(new Date(p.date));

        header.append(nameSpan, dateSpan);

        const msgDiv = document.createElement('div');
        msgDiv.className = 'gb-post-message';
        msgDiv.textContent = p.message;

        post.append(header, msgDiv);
    }

    if (p.reply) {
        const replyDiv = document.createElement('div');
        replyDiv.className = 'gb-reply';

        const replyHeader = document.createElement('div');
        replyHeader.className = 'gb-reply-header';

        const acorn = document.createElement('img');
        acorn.src = '/assets/icons/acorn.png';
        acorn.className = 'gb-post-icon';
        acorn.setAttribute('data-tip', 'squirrel');

        const rName = document.createElement('span');
        rName.className = 'gb-reply-name';
        rName.textContent = 'squirrel';

        const rDate = document.createElement('span');
        rDate.className = 'gb-reply-date';
        rDate.textContent = p.replyDate ? fmt(new Date(p.replyDate)) : '';

        replyHeader.append(acorn, rName, rDate);

        const rMsg = document.createElement('div');
        rMsg.className = 'gb-reply-message';
        rMsg.textContent = p.reply;

        replyDiv.append(replyHeader, rMsg);
        post.appendChild(replyDiv);
    }

    return post;
}

function loadPosts() {
    fetch(SCRIPT_URL)
        .then(r => r.json())
        .then(data => {
            loadingEl?.remove();
            listEl.querySelectorAll('.gb-dynamic').forEach(el => el.remove());

            const posts = Array.isArray(data) ? data : Object.values(data).reverse();
            statCount.textContent = posts.length;
            if (statLabel) statLabel.textContent = posts.length === 1 ? 'message' : 'messages';

            if (!posts.length) {
                const empty = document.createElement('div');
                empty.className = 'gb-messages-empty gb-dynamic';
                empty.textContent = 'no messages yet.. make the first one!!';
                listEl.appendChild(empty);
                return;
            }

            posts.forEach(p => listEl.appendChild(buildPost(p)));

            if (window.initTooltip) initTooltip();
        })
        .catch(() => {
            if (loadingEl) loadingEl.textContent = "couldn't load messages..";
        });
}

loadPosts();

submitBtn.addEventListener('click', async () => {
    const name = document.getElementById('gb-name').value.trim();
    const site = document.getElementById('gb-site').value.trim();
    const message = document.getElementById('gb-message').value.trim();
    const color = colorInput.value;

    if (!name || !message) {
        statusEl.textContent = 'name and message are required.';
        return;
    }

    const token = turnstileWidget !== null ? turnstile.getResponse(turnstileWidget) : '';
    if (!token) {
        statusEl.textContent = 'please complete the captcha.';
        return;
    }

    submitBtn.disabled = true;
    statusEl.textContent = 'signing.......';

    const payload = JSON.stringify({ name, message, site, color, token, ip: clientIp });

    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
            body: payload
        });

        statusEl.textContent = 'signed!! reloading...';
        setTimeout(() => location.reload(), 1500);
    } catch (err) {
        statusEl.textContent = 'something went wrong, try again.';
        if (turnstileWidget !== null) turnstile.reset(turnstileWidget);
        submitBtn.disabled = false;
    }
});