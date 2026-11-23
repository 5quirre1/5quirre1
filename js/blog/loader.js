
(() => {
    const BASE = '/blog/';
    const PER_PAGE = 5;
    const content = document.getElementById('post-content');

    if (!content) return;

    let posts = [];
    let page = 1;

    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function formatDate(date) {
        const [y, m, d] = date.split('-');
        return `${m}/${d}/${y}`;
    }

    function getSlug() {
        return location.pathname
            .replace(/^\/blog\/?/, '')
            .replace(/index\.html$/, '')
            .replace(/\/+$/, '');
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

    function renderHeader(post) {
        const header = el('div', 'blog-post-header');
        const top = el('div', 'blog-post-header-top');
        const titleWrap = el('div', 'blog-post-title-wrap');
        const title = el('span', 'blog-post-title-marquee', post.title);
        const back = el('a', 'blog-post-back', 'back');

        back.href = '/blog';

        title.id = 'post-title-bar';
        titleWrap.append(title);

        top.append(
            back,
            el('span', 'blog-post-bar-sep', '|'),
            titleWrap,
            el('span', 'blog-post-bar-sep', '|'),
            el('span', 'blog-post-bar-date', formatDate(post.date))
        );

        header.append(top, el('hr', 'blog-post-header-hr'));
        return header;
    }

    function renderCategories() {
        const start = (page - 1) * PER_PAGE;
        const visiblePosts = posts.slice(start, start + PER_PAGE);
        const totalPages = Math.ceil(posts.length / PER_PAGE);
        const categories = {};

        visiblePosts.forEach(post => {
            const category = post.category || 'uncategorized';

            if (!categories[category]) {
                categories[category] = [];
            }

            categories[category].push(post);
        });

        const container = el('div', 'blog-categories');

        Object.entries(categories).forEach(([category, categoryPosts]) => {
            const section = el('section', 'blog-category');
            const heading = el('h2', 'blog-category-title', category);
            const list = el('ul', 'blog-category-posts');

            categoryPosts.forEach(post => {
                const item = el('li', 'blog-category-post-item');
                const top = el('div', 'blog-category-post-top');
                const link = el('a', 'blog-category-post', post.title);

                link.href = BASE + post.slug;

                top.append(
                    link,
                    el('span', 'blog-category-post-date', formatDate(post.date))
                );

                item.append(top);

                if (post.description) {
                    item.append(
                        el('p', 'blog-category-post-description', post.description)
                    );
                }

                list.append(item);
            });

            section.append(heading, list);
            container.append(section);
        });

        if (totalPages > 1) {
            const nav = el('nav', 'blog-pagination');
            nav.setAttribute('aria-label', 'blog pages');

            const list = el('ul', 'blog-pagination-list');

            for (let i = 1; i <= totalPages; i++) {
                const item = document.createElement('li');

                if (i === page) {
                    const current = el('span', '', `[${i}]`);
                    current.setAttribute('aria-current', 'page');
                    item.append(current);
                } else {
                    const link = el('a', '', `[${i}]`);
                    link.href = '#';
                    link.dataset.page = i;
                    item.append(link);
                }

                list.append(item);
            }

            nav.append(list);
            container.append(nav);
        }

        container.addEventListener('click', event => {
            const link = event.target.closest('a[data-page]');

            if (!link) return;

            event.preventDefault();
            page = Number(link.dataset.page);
            renderCategories();
        });

        content.replaceChildren(container);
    }

    async function renderPost(slug) {
        const post = posts.find(p => p.slug.replace(/\/+$/, '') === slug);

        if (!post) {
            content.replaceChildren(el('p', 'blog-status', 'post not found.'));
            return;
        }

        content.replaceChildren(el('p', 'blog-status', 'loading...'));

        try {
            const response = await fetch(`${BASE}posts/${post.slug}.md`);
            if (!response.ok) throw new Error();

            const markdown = await response.text();
            const body = el('div', 'blog-post-body');

            body.innerHTML = marked.parse(markdown);

            content.replaceChildren(
                renderHeader(post),
                body,
                createLikeButton(post)
            );

            document.title = `${post.title} - blog`;

            const titleEl = document.getElementById('post-title-bar');

            if (titleEl && typeof maybeMarquee === 'function') {
                maybeMarquee(titleEl, post.title);
            }

            loadLikeBtn();
        } catch {
            content.replaceChildren(el('p', 'blog-status', 'could not load post.'));
        }
    }

    async function init() {
        content.replaceChildren(el('p', 'blog-status', 'loading...'));

        try {
            const response = await fetch(`${BASE}posts.json`);
            if (!response.ok) throw new Error();

            posts = await response.json();
            posts.sort((a, b) => b.date.localeCompare(a.date));

            const slug = getSlug();

            if (slug) {
                await renderPost(slug);
            } else {
                renderCategories();
            }
        } catch {
            content.replaceChildren(el('p', 'blog-status', 'could not load posts.'));
        }
    }

    init();
})();
