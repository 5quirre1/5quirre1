const grid = document.getElementById('gallery-grid');
const filter = document.getElementById('gallery-date-filter');

const lightbox = document.getElementById('gallery-lightbox');
const lbImg = document.getElementById('gallery-lightbox-img');
const lbMeta = document.getElementById('gallery-lightbox-meta');
const lbCounter = document.getElementById('gallery-lightbox-counter');
const lbClose = document.getElementById('gallery-lightbox-close');
const lbPrev = document.getElementById('gallery-lightbox-prev');
const lbNext = document.getElementById('gallery-lightbox-next');

const statTotal = document.getElementById('stat-total');
const statMonths = document.getElementById('stat-months');
const statYears = document.getElementById('stat-years');

let allPhotos = [];
let currentPhotos = [];
let currentIndex = 0;

const BATCH_SIZE = 20;

function maybeMarquee(el) {
    requestAnimationFrame(() => {
        el.classList.toggle(
            'marquee-text',
            el.scrollWidth > el.parentElement.clientWidth
        );
    });
}

const imageObserver = new IntersectionObserver((entries, obs) => {
    for (const e of entries) {
        if (!e.isIntersecting) continue;

        const img = e.target;
        img.src = img.dataset.src;
        img.onload = () => img.classList.add('loaded');
        img.removeAttribute('data-src');
        obs.unobserve(img);
    }
}, { rootMargin: '300px' });

const formatDate = (d = '') => {
    const [y = '??', m = '??', day = '??'] = d.split('-');
    return `${m}/${day}/${y}`;
};

const formatMonthYear = (d) => {
    const [y, m] = d.split('-');
    return new Date(y, m - 1).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });
};

const formatCount = (n, w) =>
    `<strong>${n}</strong> ${w}${n === 1 ? '' : 's'}`;

const preload = (src) => {
    requestIdleCallback(() => {
        const img = new Image();
        img.src = src;
    });
};

const sortPhotos = (a, b) => (b.date < a.date ? -1 : 1);

function openLightbox(index) {
    currentIndex = index;
    const photo = currentPhotos[index];

    lbImg.src = photo.src;

    lbMeta.textContent = [
        formatDate(photo.date),
        photo.caption
    ].filter(Boolean).join(' - ');

    lbCounter.textContent = `${index + 1} / ${currentPhotos.length}`;

    lbPrev.classList.toggle('hidden', index === 0);
    lbNext.classList.toggle('hidden', index === currentPhotos.length - 1);

    lightbox.classList.add('open');

    if (currentPhotos[index + 1]) {
        preload(currentPhotos[index + 1].src);
    }
}

function closeLightbox() {
    lightbox.classList.remove('open');
}

function renderGrid(photos) {
    currentPhotos = photos;

    if (!photos.length) {
        grid.innerHTML = '<p class="gallery-empty">no photos yet..........</p>';
        return;
    }

    grid.replaceChildren();

    let i = 0;

    const renderBatch = () => {
        const frag = document.createDocumentFragment();
        const end = Math.min(i + BATCH_SIZE, photos.length);

        for (; i < end; i++) {
            const photo = photos[i];

            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.dataset.index = i;

            const img = document.createElement('img');
            img.dataset.src = photo.thumb || photo.src;
            img.alt = photo.caption || 'photo';
            img.loading = 'lazy';
            img.decoding = 'async';

            const overlay = document.createElement('div');
            overlay.className = 'gallery-item-overlay';

            const dateText = document.createElement('span');
            dateText.textContent = formatDate(photo.date);

            overlay.appendChild(dateText);

            if (photo.caption) {
                const sep = document.createElement('span');
                sep.className = 'gallery-item-sep';
                sep.textContent = '-';

                const capWrap = document.createElement('span');
                capWrap.className = 'gallery-item-caption-wrap';

                const capText = document.createElement('span');
                capText.className = 'gallery-item-caption-text';
                capText.textContent = photo.caption;

                maybeMarquee(capText);

                capWrap.appendChild(capText);
                overlay.append(sep, capWrap);
            }

            item.appendChild(img);
            item.appendChild(overlay);

            frag.appendChild(item);

            imageObserver.observe(img);
        }

        grid.appendChild(frag);

        if (i < photos.length) {
            requestIdleCallback(renderBatch);
        }
    };

    requestIdleCallback(renderBatch);
}

grid.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    openLightbox(Number(item.dataset.index));
});

filter.addEventListener('change', () => {
    const val = filter.value;

    const filtered = val === 'all'
        ? allPhotos
        : allPhotos.filter(p => p.date.startsWith(val));

    statTotal.innerHTML = formatCount(filtered.length, 'photo');
    renderGrid(filtered);
});

lbPrev.onclick = (e) => {
    e.stopPropagation();
    if (currentIndex > 0) openLightbox(currentIndex - 1);
};

lbNext.onclick = (e) => {
    e.stopPropagation();
    if (currentIndex < currentPhotos.length - 1) {
        openLightbox(currentIndex + 1);
    }
};

lbClose.onclick = closeLightbox;

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
        openLightbox(currentIndex - 1);
    }
    if (e.key === 'ArrowRight' && currentIndex < currentPhotos.length - 1) {
        openLightbox(currentIndex + 1);
    }
});

fetch('components/gallery/photos.json')
    .then(r => r.json())
    .then(photos => {
        allPhotos = photos.sort(sortPhotos);

        const months = [...new Set(allPhotos.map(p => p.date.slice(0, 7)))].sort().reverse();
        const years = [...new Set(allPhotos.map(p => p.date.slice(0, 4)))].sort().reverse();

        statTotal.innerHTML = formatCount(allPhotos.length, 'photo');
        statMonths.innerHTML = formatCount(months.length, 'month');
        statYears.innerHTML = formatCount(years.length, 'year');

        const frag = document.createDocumentFragment();

        for (const d of months) {
            const opt = document.createElement('option');
            opt.value = d;
            opt.textContent = formatMonthYear(d);
            frag.appendChild(opt);
        }

        filter.appendChild(frag);

        requestAnimationFrame(() => renderGrid(allPhotos));
    })
    .catch(() => {
        grid.innerHTML = '<p class="gallery-empty">could not load photos.,.</p>';
    });