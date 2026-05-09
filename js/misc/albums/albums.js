const ALBUMS_JSON = 'components/albums/albums.json';

const grid = document.getElementById('albums-grid');

function formatDuration(value) {
    let totalSeconds = 0;

    if (typeof value === 'number') {
        totalSeconds = value;
    } else if (typeof value === 'string') {
        const parts = value.split(':').map(Number);

        if (parts.length === 2) {
            totalSeconds = (parts[0] * 60) + parts[1];
        } else if (parts.length === 3) {
            totalSeconds =
                (parts[0] * 3600) +
                (parts[1] * 60) +
                parts[2];
        }
    }

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    if (h > 0) {
        return `${h}h ${m}m ${s}s`;
    }

    if (m > 0) {
        return `${m}m ${s}s`;
    }

    return `${s}s`;
}

function renderStars(rating) {
    const wrap = document.createElement('div');
    wrap.className = 'album-stars';

    for (let i = 1; i <= 5; i++) {
        const img = document.createElement('img');
        img.alt = '';
        img.src =
            rating >= i
                ? '/assets/icons/star-full.png'
                : rating >= i - 0.5
                    ? '/assets/icons/star-half.png'
                    : '/assets/icons/star-none.png';

        wrap.appendChild(img);
    }

    return wrap;
}

function metaRow(label, text) {
    const row = document.createElement('div');
    row.className = 'album-meta-row';

    const l = document.createElement('span');
    l.className = 'album-meta-label';
    l.textContent = label;

    const vWrap = document.createElement('span');
    vWrap.className = 'album-meta-value';

    const v = document.createElement('span');

    if (window.maybeMarquee) {
        maybeMarquee(v, text);
    } else {
        v.textContent = text;
    }

    vWrap.appendChild(v);
    row.append(l, vWrap);

    return row;
}

function buildCard(data) {
    const card = document.createElement('div');
    card.className = 'album-card';

    const thumbWrap = document.createElement('a');
    thumbWrap.className = 'album-thumb-wrap';
    thumbWrap.href = data.href || '#';
    thumbWrap.target = '_blank';
    thumbWrap.rel = 'noopener noreferrer';

    if (data.tip) {
        thumbWrap.setAttribute('data-tip', data.tip);
    }

    const img = document.createElement('img');
    img.src = data.img;
    img.alt = data.tip || '';
    img.loading = 'lazy';
    img.decoding = 'async';

    thumbWrap.appendChild(img);

    const info = document.createElement('div');
    info.className = 'album-info';

    const inner = document.createElement('div');
    inner.className = 'album-info-inner';

    const content = document.createElement('div');
    content.className = 'album-info-content';

    content.appendChild(renderStars(data.rating));

    const meta = document.createElement('div');
    meta.className = 'album-meta';

    if (data.artist) {
        meta.appendChild(metaRow('artist', data.artist));
    }

    if (data.album) {
        meta.appendChild(metaRow('album', data.album));
    }

    if (data.year) {
        meta.appendChild(metaRow('year', String(data.year)));
    }

    if (data.tracks) {
        meta.appendChild(metaRow('tracks', String(data.tracks)));
    }

    if (data.length) {
        meta.appendChild(
            metaRow('length', formatDuration(data.length))
        );
    }

    if (data.genre) {
        const genre = Array.isArray(data.genre)
            ? data.genre.join(', ')
            : data.genre;

        meta.appendChild(metaRow('genre', genre));
    }

    content.appendChild(meta);

    const reviewText = data.review?.trim();
    const isEmpty = !reviewText;

    const revWrap = document.createElement('div');
    revWrap.className = 'album-review-wrap';

    if (isEmpty) {
        revWrap.classList.add('empty');
    }

    const rev = document.createElement('span');
    rev.className = 'album-review';

    const text = reviewText || 'no review';

    if (window.maybeMarquee) {
        maybeMarquee(rev, text);
    } else {
        rev.textContent = text;
    }

    revWrap.appendChild(rev);
    content.appendChild(revWrap);

    if (data.href) {
        const link = document.createElement('a');
        link.className = 'album-link';
        link.href = data.href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'open album';

        content.appendChild(link);
    }

    inner.appendChild(content);
    info.appendChild(inner);

    const openBtn = document.createElement('div');
    openBtn.className = 'album-open-btn';
    openBtn.textContent = 'open';

    let open = false;

    openBtn.addEventListener('click', () => {
        open = !open;

        info.classList.toggle('open', open);
        openBtn.textContent = open ? 'close' : 'open';
    });

    card.append(thumbWrap, info, openBtn);

    return card;
}

fetch(ALBUMS_JSON)
    .then(r => r.json())
    .then(data => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const i = +entry.target.dataset.index;

                entry.target.replaceWith(buildCard(data[i]));
                observer.unobserve(entry.target);
            });
        }, {
            rootMargin: '200px'
        });

        data.forEach((_, i) => {
            const ph = document.createElement('div');

            ph.dataset.index = i;
            ph.style.cssText =
                'width:100%;aspect-ratio:1;background:#f5f5f5;';

            grid.appendChild(ph);
            observer.observe(ph);
        });

        if (window.initTooltip) {
            initTooltip();
        }
    })
    .catch(() => {
        grid.innerHTML =
            '<p style="color:#aaa;font-size:13px;grid-column:1/-1;">could not load albums.</p>';
    });