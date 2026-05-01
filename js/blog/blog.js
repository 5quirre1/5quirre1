const list = document.getElementById('blog-list');
const filter = document.getElementById('blog-date-filter');
const statPosts = document.getElementById('stat-posts');
const lastDate = document.getElementById('blog-last-date');
let allPosts = [];
let newestDate = null;

function formatDate(dateStr) {
    const [y, m, d] = dateStr.split('-');
    return `${m}/${d}/${y}`;
}

function formatMonthYear(dateStr) {
    const [year, month] = dateStr.split('-');
    return new Date(year, month - 1).toLocaleDateString('en-US', {
        month: 'long', year: 'numeric'
    });
}

function renderList(posts) {
    list.innerHTML = '';

    if (!posts.length) {
        list.innerHTML = '<p class="blog-empty">no posts yet..........</p>';
        return;
    }

    posts.forEach(post => {
        const isNew = post.date === newestDate;

        const a = document.createElement('a');
        a.className = 'blog-card';
        a.href = `/blog/${post.slug}`;

        if (post.thumbnail) {
            const img = document.createElement('img');
            img.className = 'blog-card-thumb';
            img.src = post.thumbnail;
            img.alt = post.title;
            img.loading = 'lazy';
            a.appendChild(img);
        } else {
            const ph = document.createElement('div');
            ph.className = 'blog-card-thumb-placeholder';
            a.appendChild(ph);
        }

        const body = document.createElement('div');
        body.className = 'blog-card-body';

        const titleRow = document.createElement('div');
        titleRow.className = 'blog-card-title-row';

        if (isNew) {
            const newIcon = document.createElement('img');
            newIcon.src = '/assets/icons/new.png';
            newIcon.className = 'blog-card-new';
            newIcon.alt = 'new';
            titleRow.appendChild(newIcon);
        }

        const title = document.createElement('span');
        title.className = 'blog-card-title';
        title.textContent = post.title;

        const sep = document.createElement('span');
        sep.className = 'blog-card-sep';
        sep.textContent = '-';

        const date = document.createElement('span');
        date.className = 'blog-card-date';
        date.textContent = formatDate(post.date);

        titleRow.append(title, sep, date);
        body.appendChild(titleRow);

        if (post.description) {
            const descWrap = document.createElement('div');
            descWrap.className = 'blog-card-desc-wrap';
            const desc = document.createElement('span');
            desc.className = 'blog-card-desc';
            descWrap.appendChild(desc);
            body.appendChild(descWrap);
            maybeMarquee(desc, post.description);
        }

        a.appendChild(body);
        list.appendChild(a);
    });
}

function applyFilter() {
    const val = filter.value;
    const filtered = val === 'all'
        ? allPosts
        : allPosts.filter(p => p.date.startsWith(val));
    statPosts.textContent = filtered.length;
    renderList(filtered);
}

fetch('/blog/posts.json')
    .then(r => r.json())
    .then(posts => {
        allPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        newestDate = allPosts[0]?.date ?? null;
        statPosts.textContent = allPosts.length;

        if (allPosts.length) {
            lastDate.textContent = formatDate(allPosts[0].date);
        }

        const months = [...new Set(allPosts.map(p => p.date.slice(0, 7)))]
            .sort((a, b) => b.localeCompare(a));

        const frag = document.createDocumentFragment();
        months.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m;
            opt.textContent = formatMonthYear(m);
            frag.appendChild(opt);
        });
        filter.appendChild(frag);

        renderList(allPosts);
    })
    .catch(() => {
        list.innerHTML = '<p class="blog-empty">could not load posts.</p>';
    });

filter.addEventListener('change', applyFilter);