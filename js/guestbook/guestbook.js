const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbywxZ15POGRVQRBaGXPvYCoA33TQgx8N3cIDqBwf2wjj4r23BKcWn_4DU6Xlpilv5ms/exec';

const listEl = document.getElementById('gb-list');
const loadingEl = document.getElementById('gb-loading');
const statCount = document.getElementById('gb-stat-count');
const statLabel = document.getElementById('gb-stat-label');
const submitBtn = document.getElementById('gb-submit');
const statusEl = document.getElementById('gb-status');
const colorInput = document.getElementById('gb-color-input');
const colorPreview = document.getElementById('gb-color-preview');

let clientIp = 'unknown';

function getClientId() {
    let id = localStorage.getItem('gb_client_id');
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('gb_client_id', id);
    }
    return id;
}

(async function () {
    try {
        clientIp = (await fetch('https://api64.ipify.org').then(r => r.text())).trim();
    } catch {
        clientIp = 'unknown';
    }
})();

colorInput.addEventListener('input', () => {
    colorPreview.style.background = colorInput.value;
});

colorPreview.addEventListener('click', () => colorInput.click());

function isRateLimited() {
    const last = localStorage.getItem('gb_last_submit');
    if (!last) return false;
    return Date.now() - Number(last) < 15 * 60 * 1000;
}

function setRateLimit() {
    localStorage.setItem('gb_last_submit', Date.now().toString());
}

function fmt(iso) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return `${d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
}

function safeColor(c) {
    return /^#[0-9a-fA-F]{6}$/.test(c) ? c : '#3D3D3D';
}

function cleanUrl(url) {
    if (!url) return null;
    try {
        const u = new URL(url.startsWith('http') ? url : 'https://' + url);
        return (u.protocol === 'http:' || u.protocol === 'https:') ? u.href : null;
    } catch {
        return null;
    }
}

function buildPost(p) {
    const post = document.createElement('div');
    post.className = 'gb-post gb-dynamic';

    const color = safeColor(p.color);
    const href = cleanUrl(p.site);
    const siteDisplay = href ? href.replace(/^https?:\/\//, '').replace(/\/$/, '') : '';

    const header = document.createElement('div');
    header.className = 'gb-post-header';

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
        header.appendChild(a);
    } else {
        const nameSpan = document.createElement('span');
        nameSpan.className = 'gb-post-name';
        nameSpan.style.color = color;
        nameSpan.textContent = p.name;
        header.appendChild(nameSpan);
    }

    const dateSpan = document.createElement('span');
    dateSpan.className = 'gb-post-date';
    dateSpan.textContent = fmt(new Date(p.date));

    header.appendChild(dateSpan);

    const msgDiv = document.createElement('div');
    msgDiv.className = 'gb-post-message';
    msgDiv.textContent = p.message;

    post.append(header, msgDiv);

    if (p.reply) {
        const replyDiv = document.createElement('div');
        replyDiv.className = 'gb-reply';

        const replyHeader = document.createElement('div');
        replyHeader.className = 'gb-reply-header';

        const rName = document.createElement('span');
        rName.className = 'gb-reply-name';
        rName.textContent = 'squirrel';

        const rDate = document.createElement('span');
        rDate.className = 'gb-reply-date';
        rDate.textContent = p.replyDate ? fmt(new Date(p.replyDate)) : '';

        replyHeader.append(rName, rDate);

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

    if (isRateLimited()) {
        statusEl.textContent = "you're rate limited — wait a bit before posting again";
        return;
    }

    if (!name || !message) {
        statusEl.textContent = 'name and message are required.';
        return;
    }

    submitBtn.disabled = true;
    statusEl.textContent = 'signing...';

    const payload = JSON.stringify({
        name,
        message,
        site,
        color,
        ip: clientIp,
        clientId: getClientId()
    });

    try {
        const res = await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
            body: payload
        });

        const data = await res.json();

        if (!data.ok) {
            submitBtn.disabled = false;

            if (data.error === 'rate limited') {
                statusEl.textContent = "you're rate limited — try again in ~15 minutes";
                return;
            }

            if (data.error === 'missing fields') {
                statusEl.textContent = "missing name or message";
                return;
            }

            statusEl.textContent = data.error || "something went wrong.";
            return;
        }

        setRateLimit();

        statusEl.textContent = 'signed!! reloading...';
        setTimeout(() => location.reload(), 1200);
    } catch {
        submitBtn.disabled = false;
        statusEl.textContent = 'network error. try again';
    }
});