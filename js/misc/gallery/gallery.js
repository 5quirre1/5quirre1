const grid = document.getElementById('gallery-grid');
const filter = document.getElementById('gallery-date-filter');

const lightbox = document.getElementById('gallery-lightbox');
const lbImg = document.getElementById('gallery-lightbox-img');
const lbMeta = document.getElementById('gallery-lightbox-meta');
const lbCounter = document.getElementById('gallery-lightbox-counter');

const lbClose = document.getElementById('gallery-lightbox-close');
const lbPrev = document.getElementById('gallery-lightbox-prev');
const lbNext = document.getElementById('gallery-lightbox-next');

const lbSpinner = document.getElementById('gallery-lightbox-spinner');

const statTotal = document.getElementById('stat-total');
const statMonths = document.getElementById('stat-months');
const statYears = document.getElementById('stat-years');

const itemTemplate = document.getElementById('gallery-item-template');
const emptyTemplate = document.getElementById('gallery-empty-template');
const spinnerTemplate = document.getElementById('gallery-spinner-template');

const BATCH_SIZE = 12;
const LOAD_DELAY = 400;

let allPhotos = [];
let currentPhotos = [];

let currentIndex = 0;
let renderedEnd = 0;
let isLoading = false;
let sentinel = null;

const imageCache = new Set();

const raf = requestAnimationFrame;

const formatDate = (d = '') => {
    const [y = '??', m = '??', day = '??'] = d.split('-');
    return `${m}/${day}/${y}`;
};

const formatMonthYear = d => {
    const [y, m] = d.split('-');

    return new Date(y, m - 1).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });
};

const formatCount = (n, w) =>
    `<strong>${n}</strong> ${w}${n === 1 ? '' : 's'}`;

const sortPhotos = (a, b) =>
    b.date < a.date ? -1 : 1;

function maybeMarquee(el) {
    raf(() => {
        el.classList.toggle(
            'marquee-text',
            el.scrollWidth > el.parentElement.clientWidth
        );
    });
}

function makeSpinner() {
    return spinnerTemplate.content.firstElementChild.cloneNode(true);
}

function preload(src) {
    if (imageCache.has(src)) return;

    requestIdleCallback(() => {
        const img = new Image();

        img.onload = () => imageCache.add(src);
        img.src = src;
    });
}

const imageObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const img = entry.target;
        const src = img.dataset.src;

        imageObserver.unobserve(img);

        if (!src) continue;

        const loader = new Image();

        loader.onload = () => {
            imageCache.add(src);

            img.src = src;
            img.classList.add('loaded');
        };

        loader.onerror = () => {
            img.classList.add('loaded');
        };

        loader.src = src;

        img.removeAttribute('data-src');
    }
}, {
    rootMargin: '300px'
});

function showGridSpinner() {
    if (document.getElementById('gallery-spinner')) return;

    const el = document.createElement('div');

    el.id = 'gallery-spinner';
    el.appendChild(makeSpinner());

    grid.after(el);
}

function hideGridSpinner() {
    document.getElementById('gallery-spinner')?.remove();
}

const sentinelObserver = new IntersectionObserver(entries => {
    if (entries[0]?.isIntersecting) {
        loadNextBatch();
    }
});

function attachSentinel() {
    sentinel?.remove();

    if (renderedEnd >= currentPhotos.length) {
        sentinel = null;
        return;
    }

    sentinel = document.createElement('div');
    sentinel.id = 'gallery-sentinel';

    grid.after(sentinel);

    sentinelObserver.observe(sentinel);
}

function buildBatch(photos, batchId, offset) {
    const batch = document.createElement('div');

    batch.className = 'gallery-batch';
    batch.dataset.batchId = batchId;
    batch.style.display = 'contents';

    const frag = document.createDocumentFragment();

    photos.forEach((p, i) => {
        const idx = offset + i;

        const node =
            itemTemplate.content.firstElementChild.cloneNode(true);

        node.dataset.index = idx;

        const img = node.children[0];
        const overlay = node.children[1];

        const date = overlay.children[0];
        const sep = overlay.children[1];
        const wrap = overlay.children[2];
        const caption = wrap.firstElementChild;

        img.dataset.src = p.thumb || p.src;
        img.alt = p.caption || 'photo';

        date.textContent = formatDate(p.date);

        if (p.caption) {
            caption.textContent = p.caption;
            maybeMarquee(caption);
        } else {
            sep.remove();
            wrap.remove();
        }

        imageObserver.observe(img);

        frag.appendChild(node);
    });

    batch.appendChild(frag);

    return batch;
}

function loadNextBatch() {
    if (isLoading || renderedEnd >= currentPhotos.length) {
        return;
    }

    isLoading = true;

    sentinel?.remove();
    sentinel = null;

    showGridSpinner();

    const run = () => {
        const id = Math.floor(renderedEnd / BATCH_SIZE);

        const start = renderedEnd;

        const end = Math.min(
            start + BATCH_SIZE,
            currentPhotos.length
        );

        const batch = buildBatch(
            currentPhotos.slice(start, end),
            id,
            start
        );

        grid.appendChild(batch);

        renderedEnd = end;
        isLoading = false;

        hideGridSpinner();
        attachSentinel();
    };

    renderedEnd === 0
        ? run()
        : setTimeout(run, LOAD_DELAY);
}

function renderGrid(photos) {
    currentPhotos = photos;

    renderedEnd = 0;
    isLoading = false;

    sentinel?.remove();
    sentinel = null;

    grid.replaceChildren();

    if (!photos.length) {
        const empty =
            emptyTemplate.content.firstElementChild.cloneNode(true);

        empty.textContent = 'no photos yet..........';

        grid.appendChild(empty);

        return;
    }

    showGridSpinner();

    loadNextBatch();
}


function openLightbox(index) {
    currentIndex = index;

    const p = currentPhotos[index];

    lbMeta.textContent = [
        formatDate(p.date),
        p.caption
    ].filter(Boolean).join(' - ');

    lbCounter.textContent =
        `${index + 1} / ${currentPhotos.length}`;

    lbPrev.classList.toggle('hidden', index === 0);

    lbNext.classList.toggle(
        'hidden',
        index === currentPhotos.length - 1
    );

    lbImg.src = p.src;

    scrollY = window.scrollY;

    document.body.style.top = `-${scrollY}px`;
    document.body.classList.add('lightbox-open');

    lightbox.classList.add('open');

    currentPhotos[index + 1] &&
        preload(currentPhotos[index + 1].src);

    currentPhotos[index - 1] &&
        preload(currentPhotos[index - 1].src);
}

function closeLightbox() {
    lightbox.classList.remove('open');

    document.body.classList.remove('lightbox-open');

    const y = Math.abs(
        parseInt(document.body.style.top || '0', 10)
    );

    document.body.style.top = '';

    window.scrollTo(0, y);
}

grid.addEventListener('click', e => {
    const item = e.target.closest('.gallery-item');

    if (item) {
        openLightbox(+item.dataset.index);
    }
});

filter.addEventListener('change', () => {
    const value = filter.value;

    const filtered =
        value === 'all'
            ? allPhotos
            : allPhotos.filter(
                p => p.date.startsWith(value)
            );

    statTotal.innerHTML =
        formatCount(filtered.length, 'photo');

    renderGrid(filtered);
});

lbPrev.onclick = () => {
    if (currentIndex) {
        openLightbox(currentIndex - 1);
    }
};

lbNext.onclick = () => {
    if (currentIndex < currentPhotos.length - 1) {
        openLightbox(currentIndex + 1);
    }
};

lbClose.onclick = closeLightbox;

lightbox.addEventListener('click', e => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) {
        return;
    }

    if (e.key === 'Escape') {
        closeLightbox();
    }

    if (e.key === 'ArrowLeft' && currentIndex) {
        openLightbox(currentIndex - 1);
    }

    if (
        e.key === 'ArrowRight' &&
        currentIndex < currentPhotos.length - 1
    ) {
        openLightbox(currentIndex + 1);
    }
});

let touchStartX = 0;
let touchStartY = 0;
let swiping = false;

lightbox.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;

    swiping = true;
}, {
    passive: true
});

lightbox.addEventListener('touchmove', e => {
    if (!swiping) return;

    const dx =
        e.touches[0].clientX - touchStartX;

    const dy =
        e.touches[0].clientY - touchStartY;

    if (Math.abs(dy) > Math.abs(dx)) {
        swiping = false;
    }
}, {
    passive: true
});

lightbox.addEventListener('touchend', e => {
    if (!swiping) return;

    swiping = false;

    const dx =
        e.changedTouches[0].clientX - touchStartX;

    if (Math.abs(dx) < 60) {
        return;
    }

    if (
        dx < 0 &&
        currentIndex < currentPhotos.length - 1
    ) {
        openLightbox(currentIndex + 1);
    }

    if (dx > 0 && currentIndex) {
        openLightbox(currentIndex - 1);
    }
});

lbSpinner.replaceChildren(makeSpinner());

showGridSpinner();

fetch('components/gallery/photos.json')
    .then(r => r.json())
    .then(photos => {
        allPhotos = photos.sort(sortPhotos);

        const months = [
            ...new Set(
                allPhotos.map(x => x.date.slice(0, 7))
            )
        ].sort().reverse();

        const years = [
            ...new Set(
                allPhotos.map(x => x.date.slice(0, 4))
            )
        ].sort().reverse();

        statTotal.innerHTML =
            formatCount(allPhotos.length, 'photo');

        statMonths.innerHTML =
            formatCount(months.length, 'month');

        statYears.innerHTML =
            formatCount(years.length, 'year');

        const frag = document.createDocumentFragment();

        months.forEach(month => {
            const opt = document.createElement('option');

            opt.value = month;
            opt.textContent = formatMonthYear(month);

            frag.appendChild(opt);
        });

        filter.appendChild(frag);

        raf(() => {
            hideGridSpinner();
            renderGrid(allPhotos);
        });
    })
    .catch(() => {
        hideGridSpinner();

        const empty =
            emptyTemplate.content.firstElementChild.cloneNode(true);

        empty.textContent =
            'could not load photos.,.';

        grid.appendChild(empty);
    });