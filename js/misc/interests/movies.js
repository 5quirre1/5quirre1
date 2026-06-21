async function loadMovies() {
    const res = await fetch('/misc/components/interests/movies.json');
    if (!res.ok) throw new Error('Failed to load movies JSON');
    return res.json();
}

function buildCoverEl(movie) {
    const img = document.createElement('img');
    img.src = movie.cover;
    img.alt = movie.title || 'movie cover';
    img.loading = 'lazy';
    img.decoding = 'async';

    if (movie.link) {
        const a = document.createElement('a');
        a.className = 'movies-popup-cover';
        a.href = movie.link;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.dataset.tip = movie.tip || movie.title;
        a.appendChild(img);
        return a;
    }

    const wrap = document.createElement('div');
    wrap.className = 'movies-popup-cover';
    wrap.dataset.tip = movie.tip || movie.title;
    wrap.appendChild(img);
    return wrap;
}

function chunk(arr, size) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) {
        out.push(arr.slice(i, i + size));
    }
    return out;
}

function renderMovieSlides(movies, track, perSlide) {
    const fragment = document.createDocumentFragment();
    const groups = chunk(movies, perSlide);

    groups.forEach((group) => {
        const slide = document.createElement('div');
        slide.className = 'movies-popup-slide';

        if (group.length < perSlide) {
            slide.classList.add('movies-popup-slide-partial');
        }

        for (const movie of group) {
            slide.appendChild(buildCoverEl(movie));
        }

        fragment.appendChild(slide);
    });

    track.replaceChildren(fragment);
    return groups.length;
}

function setupMoviesSlideAnimation(widget, track, slideCount) {
    const animName = 'movies-popup-slide-dyn';
    document.getElementById(animName)?.remove();

    track.style.removeProperty('animation');
    track.style.transform = 'translate3d(0,0,0)';

    if (slideCount < 2) return;

    const holdMs = 5200;
    const slideMs = 800;
    const stepMs = holdMs + slideMs;

    const forward = Array.from({ length: slideCount }, (_, i) => i);
    const back = forward.slice(1, -1).reverse();

    const positions = slideCount === 2
        ? [0, 1, 0]
        : [...forward, ...back];

    const totalMs = positions.length * stepMs;
    const keyframes = [];

    positions.forEach((index, i) => {
        const holdStart = ((i * stepMs) / totalMs) * 100;
        const slideStart = ((i * stepMs + holdMs) / totalMs) * 100;
        const nextIndex = positions[(i + 1) % positions.length];
        const slideEnd = (((i + 1) * stepMs) / totalMs) * 100;

        keyframes.push(`${holdStart.toFixed(4)}% { transform: translate3d(${-(index * 100)}%,0,0); }`);
        keyframes.push(`${slideStart.toFixed(4)}% { transform: translate3d(${-(index * 100)}%,0,0); }`);
        keyframes.push(`${slideEnd.toFixed(4)}% { transform: translate3d(${-(nextIndex * 100)}%,0,0); }`);
    });

    const style = document.createElement('style');
    style.id = animName;
    style.textContent = `
        @keyframes ${animName} {
            ${keyframes.join('\n')}
        }

        .movies-popup-track {
            animation: ${animName} ${totalMs}ms linear infinite;
            will-change: transform;
        }
    `;

    document.head.appendChild(style);

    widget.addEventListener('mouseenter', () => {
        track.style.animationPlayState = 'paused';
    });

    widget.addEventListener('mouseleave', () => {
        track.style.animationPlayState = 'running';
    });
}

const imageCache = new Map();

function preloadImages(movies) {
    movies.forEach(movie => {
        if (!imageCache.has(movie.cover)) {
            const img = new Image();
            img.src = movie.cover;
            imageCache.set(movie.cover, img);
        }
    });
}

async function initFavoriteMoviesShit() {
    const trigger = document.querySelector('.interests-text-scroll');
    const popup = document.querySelector('.movies-popup');
    const viewport = document.querySelector('.movies-popup-viewport');
    const track = document.querySelector('.movies-popup-track');

    if (!trigger || !popup || !viewport || !track) return;

    let loaded = false;
    let hoveringTrigger = false;
    let hoveringPopup = false;
    let moviesData = null;

    function updateVisibility() {
        const active = hoveringTrigger || hoveringPopup;
        popup.classList.toggle('movies-popup-visible', active);
        trigger.classList.toggle('movies-trigger-active', active);
    }

    async function ensureLoaded() {
        if (loaded) return;
        loaded = true;
        try {
            moviesData = await loadMovies();
            preloadImages(moviesData);
            const slideCount = renderMovieSlides(moviesData, track, 3);
            setupMoviesSlideAnimation(viewport, track, slideCount);
        } catch (err) {
            track.replaceChildren();
            loaded = false;
            return;
        }
        initTooltip();
    }

    trigger.addEventListener('mouseenter', () => {
        hoveringTrigger = true;
        updateVisibility();
        ensureLoaded();
    });

    trigger.addEventListener('mouseleave', () => {
        hoveringTrigger = false;
        setTimeout(() => {
            if (!hoveringTrigger && !hoveringPopup) updateVisibility();
        }, 60);
    });

    popup.addEventListener('mouseenter', () => {
        hoveringPopup = true;
        updateVisibility();
    });

    popup.addEventListener('mouseleave', () => {
        hoveringPopup = false;
        updateVisibility();
    });
}

document.addEventListener('includesLoaded', initFavoriteMoviesShit);