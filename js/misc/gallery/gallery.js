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

function formatDate(dateStr) {
    const parts = dateStr.split('-');
    return parts.length === 3
        ? `${parts[1]}/${parts[2]}/${parts[0]}`
        : `${parts[1]}/??/${parts[0]}`;
}

function formatMonthYear(dateStr) {
    const [year, month] = dateStr.split('-');
    return new Date(year, month - 1).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });
}

function formatCount(num, word) {
    return `<strong>${num}</strong> ${word}${num === 1 ? '' : 's'}`;
}

function maybeMarquee(el) {
    el.style.display = 'inline-block';
    requestAnimationFrame(() => {
        el.classList.toggle(
            'marquee-text',
            el.scrollWidth > el.parentElement.clientWidth
        );
    });
}

function openLightbox(index) {
    currentIndex = index;
    const photo = currentPhotos[currentIndex];

    lbImg.src = photo.src;
    lbMeta.textContent = [formatDate(photo.date), photo.caption]
        .filter(Boolean)
        .join(' - ');
    lbCounter.textContent = `${currentIndex + 1} / ${currentPhotos.length}`;

    lbPrev.classList.toggle('hidden', currentIndex === 0);
    lbNext.classList.toggle('hidden', currentIndex === currentPhotos.length - 1);

    lightbox.classList.add('open');
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

    grid.innerHTML = '';

    photos.forEach((photo, i) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';

        const img = document.createElement('img');
        img.src = photo.src;
        img.alt = photo.caption || 'photo';
        img.loading = 'lazy';

        const overlay = document.createElement('div');
        overlay.className = 'gallery-item-overlay';

        const dateEl = document.createElement('span');
        dateEl.className = 'gallery-item-date';
        dateEl.textContent = formatDate(photo.date);
        overlay.appendChild(dateEl);

        if (photo.caption) {
            const sep = document.createElement('span');
            sep.className = 'gallery-item-sep';
            sep.textContent = '-';

            const capWrap = document.createElement('span');
            capWrap.className = 'gallery-item-caption-wrap';

            const capText = document.createElement('span');
            capText.className = 'gallery-item-caption-text';
            capText.textContent = photo.caption;

            capWrap.appendChild(capText);
            overlay.append(sep, capWrap);
            maybeMarquee(capText);
        }

        item.append(img, overlay);
        item.addEventListener('click', () => openLightbox(i));
        grid.appendChild(item);
    });
}

function applyFilter() {
    const val = filter.value;
    const filtered = val === 'all'
        ? allPhotos
        : allPhotos.filter(p => p.date.startsWith(val));

    statTotal.innerHTML = formatCount(filtered.length, 'photo');
    renderGrid(filtered);
}

fetch('components/gallery/photos.json')
    .then(r => r.json())
    .then(photos => {
        allPhotos = photos.sort((a, b) => new Date(b.date) - new Date(a.date));

        const months = [...new Set(allPhotos.map(p => p.date.slice(0, 7)))]
            .sort((a, b) => b.localeCompare(a));

        const years = [...new Set(allPhotos.map(p => p.date.slice(0, 4)))]
            .sort((a, b) => b.localeCompare(a));

        statTotal.innerHTML = formatCount(allPhotos.length, 'photo');
        statMonths.innerHTML = formatCount(months.length, 'month');
        statYears.innerHTML = formatCount(years.length, 'year');

        const frag = document.createDocumentFragment();
        months.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d;
            opt.textContent = formatMonthYear(d);
            frag.appendChild(opt);
        });
        filter.appendChild(frag);

        renderGrid(allPhotos);
    })
    .catch(() => {
        grid.innerHTML = '<p class="gallery-empty">could not load photos.,.</p>';
    });

filter.addEventListener('change', applyFilter);

lbPrev.addEventListener('click', e => {
    e.stopPropagation();
    if (currentIndex > 0) openLightbox(currentIndex - 1);
});

lbNext.addEventListener('click', e => {
    e.stopPropagation();
    if (currentIndex < currentPhotos.length - 1) openLightbox(currentIndex + 1);
});

lbClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && currentIndex > 0) openLightbox(currentIndex - 1);
    if (e.key === 'ArrowRight' && currentIndex < currentPhotos.length - 1) openLightbox(currentIndex + 1);
});