(() => {
    const INLINE = false;
    const PER_PAGE = 5;
    const BASE = '/blog/';
    const CATEGORY_DIR = '/assets/blog/categories/';
    const INDEX_URL = `${BASE}posts/index.md`;

    const content = document.getElementById('post-content');
    if (!content) return;
    const wrap = content.parentElement;

    let posts = [];
    let categories = {};
    let welcomeHtml = '';
    let current = null;
    let page = 1;
    let token = 0;
    let itemsEl;
    let pagesEl;

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function status(text) {
        return el('p', 'blog-status', text);
    }

    function formatDate(dateStr) {
        const [y, m, d] = dateStr.split('-');
        return `${m}/${d}/${y}`;
    }

    function slugFromPath() {
        return window.location.pathname
            .replace(/^\/blog\/?/, '')
            .replace(/index\.html$/, '')
            .replace(/\/+$/, '');
    }

    function categoryKey(value) {
        return String(value || '').trim().toLowerCase().replace(/[^\w-]/g, '-');
    }

    function parseIndex(text) {
        const map = {};
        let body = text.replace(/\r\n?/g, '\n');
        const front = body.match(/^---\n([\s\S]*?)\n---\n?/);

        if (front) {
            body = body.slice(front[0].length);
            front[1].split('\n').forEach((line) => {
                const at = line.indexOf(':');
                if (at < 1) return;
                map[categoryKey(line.slice(0, at))] = line.slice(at + 1).trim();
            });
        }

        return { map, body };
    }

    function createLikeButton(post) {
        const box = el('div', 'blog-likebtn blog-likebtn-bottom');
        const btn = el('span', 'likebtn-wrapper');
        btn.dataset.theme = 'greenred';
        btn.dataset.identifier = `squirrelz_blog_${post.slug.replace(/[^\w-]/g, '_')}`;
        box.append(btn);
        return box;
    }

    function loadLikeBtn() {
        if (document.getElementById('likebtn_wjs')) {
            if (window.LikeBtn) window.LikeBtn.init();
            return;
        }

        const script = document.createElement('script');
        script.id = 'likebtn_wjs';
        script.async = true;
        script.src = '//w.likebtn.com/js/w/widget.js';
        document.head.appendChild(script);
    }

    function createHeader(post) {
        const header = el('div', 'blog-post-header');
        const top = el('div', 'blog-post-header-top');
        const titleWrap = el('div', 'blog-post-title-wrap');
        const title = el('span', 'blog-post-title-marquee', post.title);
        title.id = 'post-title-bar';
        titleWrap.append(title);
        top.append(
            titleWrap,
            el('span', 'blog-post-bar-sep', '|'),
            el('span', 'blog-post-bar-date', formatDate(post.date))
        );
        header.append(top, el('hr', 'blog-post-header-hr'));
        return header;
    }

    function categoryIcon(value) {
        const name = categoryKey(value) || 'unknown';
        const info = categories[name];
        const fallback = `${CATEGORY_DIR}category-unknown.png`;
        const img = el('img', 'blog-list-icon');
        img.width = 16;
        img.height = 16;
        img.alt = name;
        img.title = info ? `${name}: ${info}` : name;
        img.src = name === 'unknown' ? fallback : `${CATEGORY_DIR}category-${name}.png`;
        img.onerror = () => {
            img.onerror = null;
            img.src = fallback;
        };
        return img;
    }

    function markActive() {
        itemsEl.querySelectorAll('a').forEach((a) => {
            if (a.dataset.slug === current) a.setAttribute('aria-current', 'page');
            else a.removeAttribute('aria-current');
        });
    }

    function createItem(post) {
        const li = document.createElement('li');
        const a = el('a', '', post.title);
        a.href = BASE + post.slug;
        a.dataset.slug = post.slug;

        li.append(
            categoryIcon(post.category),
            el('span', 'blog-list-date', formatDate(post.date)),
            el('span', 'blog-list-sep', ' - '),
            a
        );

        if (post.description) {
            li.append(
                el('span', 'blog-list-sep', ' - '),
                el('span', 'blog-list-desc', post.description)
            );
        }

        return li;
    }

    function renderList() {
        const total = Math.max(1, Math.ceil(posts.length / PER_PAGE));
        page = Math.min(Math.max(page, 1), total);
        const start = (page - 1) * PER_PAGE;

        itemsEl.replaceChildren(...posts.slice(start, start + PER_PAGE).map(createItem));
        markActive();

        const nums = [];
        for (let i = 1; i <= total; i++) {
            if (i === page) {
                const now = el('span', '', `[${i}]`);
                now.setAttribute('aria-current', 'page');
                now.setAttribute('aria-label', `page ${i}, current page`);
                now.tabIndex = -1;
                nums.push(now);
            } else {
                const a = el('a', '', `[${i}]`);
                a.href = '#';
                a.dataset.page = i;
                a.setAttribute('aria-label', `page ${i}`);
                nums.push(a);
            }
        }
        pagesEl.replaceChildren(...nums);
        pagesEl.hidden = total < 2;
    }

    function onClick(e) {
        const link = e.target.closest('a');
        if (!link) return;

        if (link.dataset.page) {
            e.preventDefault();
            page = Number(link.dataset.page);
            renderList();
            const now = pagesEl.querySelector('[aria-current]');
            if (now) now.focus({ preventScroll: true });
            return;
        }

        if (INLINE && link.dataset.slug) {
            if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            if (link.dataset.slug !== current) show(link.dataset.slug, true);
        }
    }

    function buildList() {
        const nav = el('nav', 'blog-list');
        nav.setAttribute('aria-label', 'blog posts');
        itemsEl = el('ul', 'blog-list-items');
        itemsEl.setAttribute('role', 'list');
        pagesEl = el('div', 'blog-pages');
        nav.append(itemsEl, pagesEl);
        wrap.addEventListener('click', onClick);
        wrap.insertBefore(nav, content);
    }

    async function show(slug, push) {
        const id = ++token;

        if (!slug) {
            current = null;
            markActive();
            document.title = 'blog';
            if (welcomeHtml) {
                const welcome = el('div', 'blog-welcome');
                welcome.innerHTML = welcomeHtml;
                content.replaceChildren(welcome);
            } else {
                content.replaceChildren(status('could not load welcome message.'));
            }
            return;
        }

        const post = posts.find((p) => p.slug === slug);
        current = post ? post.slug : null;

        if (!post) {
            markActive();
            document.title = 'blog';
            content.replaceChildren(status('post not found.'));
            return;
        }

        const target = Math.floor(posts.indexOf(post) / PER_PAGE) + 1;
        if (target !== page) {
            page = target;
            renderList();
        } else {
            markActive();
        }

        if (push) history.pushState(null, '', BASE + post.slug);

        content.replaceChildren(status('loading...'));

        let md;
        try {
            const res = await fetch(`${BASE}posts/${post.slug}.md`);
            if (!res.ok) throw new Error('not found');
            md = await res.text();
        } catch {
            if (id === token) content.replaceChildren(status('could not load post.'));
            return;
        }

        if (id !== token) return;

        const body = el('div', 'blog-post-body');
        body.innerHTML = marked.parse(md);

        content.replaceChildren(createHeader(post), body, createLikeButton(post));
        document.title = `${post.title} - blog`;

        const titleEl = document.getElementById('post-title-bar');
        if (titleEl && typeof maybeMarquee === 'function') maybeMarquee(titleEl, post.title);

        loadLikeBtn();
    }

    async function loadPosts() {
        const res = await fetch(`${BASE}posts.json`);
        if (!res.ok) throw new Error('not found');
        return [...(await res.json())].sort((a, b) => b.date.localeCompare(a.date));
    }

    async function loadIndex() {
        try {
            const res = await fetch(INDEX_URL);
            if (!res.ok) throw new Error('not found');
            const { map, body } = parseIndex(await res.text());
            categories = map;
            welcomeHtml = marked.parse(body);
        } catch {
            categories = {};
            welcomeHtml = '';
        }
    }

    async function init() {
        content.replaceChildren(status('loading...'));

        try {
            [posts] = await Promise.all([loadPosts(), loadIndex()]);
        } catch {
            content.replaceChildren(status('could not load post.'));
            return;
        }

        if (!posts.length) {
            content.replaceChildren(status('no posts yet.'));
            return;
        }

        buildList();
        renderList();
        if (INLINE) window.addEventListener('popstate', () => show(slugFromPath(), false));
        show(slugFromPath(), false);
    }

    init();
})();