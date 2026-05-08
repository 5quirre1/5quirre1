const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyrzFdcEfPTdo0wty3isNY6BjqbZaLhXd1OW-IVdQRKZAbUuupmtW5f_NylUkFd9yWW/exec';

const listEl = document.getElementById('gb-list');
const loadingEl = document.getElementById('gb-loading');
const statCount = document.getElementById('gb-stat-count');
const submitBtn = document.getElementById('gb-submit');
const statusEl = document.getElementById('gb-status');
const colorInput = document.getElementById('gb-color-input');
const colorPreview = document.getElementById('gb-color-preview');

colorInput.addEventListener('input', () => {
    colorPreview.style.background = colorInput.value;
});

colorPreview.addEventListener('click', () => {
    colorInput.click();
});

function fmt(iso) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';

    return `${d.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    })}, ${d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    })}`;
}

function escapeHtml(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function safeColor(color) {
    return /^#[0-9a-fA-F]{6}$/.test(color) ? color : '#3D3D3D';
}

function cleanUrl(url) {
    if (!url) return null;
    try {
        const u = new URL(url.startsWith('http') ? url : 'https://' + url);
        if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
        return u.href;
    } catch {
        return null;
    }
}

function safeDate(d) {
    const date = new Date(d);
    return isNaN(date.getTime()) ? new Date() : date;
}

document.getElementById('gb-pinned-date').textContent =
    fmt(new Date()).split(',')[0];

function loadPosts() {
    fetch(SCRIPT_URL)
        .then(r => r.json())
        .then(data => {
            loadingEl?.remove();
            listEl.querySelectorAll('.gb-dynamic').forEach(el => el.remove());

            const posts = Array.isArray(data) ? data : Object.values(data).reverse();
            const statLabel = document.getElementById('gb-stat-label')
            const count = posts.length;
            statCount.textContent = count;
            statLabel.textContent = count === 1 ? 'message' : 'messages';

            if (!posts.length) {
                const empty = document.createElement('div');
                empty.className = 'gb-messages-empty gb-dynamic';
                empty.textContent = 'no messages yet.. make the first one!!';
                listEl.appendChild(empty);
                return;
            }

            posts.forEach(p => {
                const post = document.createElement('div');
                post.className = 'gb-post gb-dynamic';

                const color = safeColor(p.color);
                const name = escapeHtml(p.name);
                const message = escapeHtml(p.message);
                const reply = escapeHtml(p.reply);

                const safeHref = cleanUrl(p.site);
                const hasSite = !!safeHref;

                const siteText = escapeHtml(
                    safeHref ? safeHref.replace(/^https?:\/\//, '') : ''
                );

                const nameInner = hasSite
                    ? `
<a href="${safeHref}" target="_blank" rel="noopener noreferrer"
   class="gb-post-name" style="color:${color};text-decoration:none;">
    <span>${name}</span>
    <span class="gb-name-url" style="color:${color};">${siteText}</span>
</a>`
                    : `<span class="gb-post-name" style="color:${color}">${name}</span>`;

                const replyHtml = p.reply
                    ? `
<div class="gb-reply">
    <div class="gb-reply-header">
        <img data-tip="squirrel" src="/assets/icons/acorn.png" class="gb-post-icon">
        <span class="gb-reply-name">squirrel</span>
        <span class="gb-reply-date">
            ${p.replyDate ? fmt(safeDate(p.replyDate)) : ''}
        </span>
    </div>
    <div class="gb-reply-message">${reply}</div>
</div>`
                    : '';

                post.innerHTML = `
<div class="gb-post-header">
    ${nameInner}
    <span class="gb-post-date">${fmt(safeDate(p.date))}</span>
</div>
<div class="gb-post-message">${message}</div>
${replyHtml}
`;

                listEl.appendChild(post);
                initTooltip();
            });
        })
        .catch(() => {
            loadingEl.textContent = 'could not load messages.';
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

    submitBtn.disabled = true;
    statusEl.textContent = 'signing.......';

    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ name, message, site, color })
        });

        document.getElementById('gb-name').value = '';
        document.getElementById('gb-site').value = '';
        document.getElementById('gb-message').value = '';
        colorInput.value = '#3D3D3D';
        colorPreview.style.background = '#3D3D3D';

        statusEl.textContent = 'signed!!';

        setTimeout(() => {
            location.reload();
        }, 800);

    } catch {
        statusEl.textContent = 'something went wrong, try again.';
    } finally {
        submitBtn.disabled = false;
    }
});