const slug = window.location.pathname.replace(/^\/blog\//, '').replace(/\/$/, '');
const content = document.getElementById('post-content');

function formatDate(dateStr) {
    const [y, m, d] = dateStr.split('-');
    return `${m}/${d}/${y}`;
}

if (!slug) {
    window.location.href = '/blog';
} else {
    Promise.all([
        fetch('/blog/posts.json').then(r => r.json()),
        fetch(`/blog/posts/${slug}.md`).then(r => {
            if (!r.ok) throw new Error('not found');
            return r.text();
        })
    ])
        .then(([posts, md]) => {
            const post = posts.find(p => p.slug === slug);
            if (post) document.title = `${post.title} - blog`;

            const title = post?.title ?? '';
            const date = post ? formatDate(post.date) : '';

            content.innerHTML = `
                    <div class="blog-post-header">
                        <div class="blog-post-header-top">
                            <a class="blog-post-back" href="/blog">back</a>
                            <span class="blog-post-bar-sep">|</span>
                            <div class="blog-post-title-wrap">
                                <span class="blog-post-title-marquee" id="post-title-bar">${title}</span>
                            </div>
                            <span class="blog-post-bar-sep">|</span>
                            <span class="blog-post-bar-date">${date}</span>
                        </div>
                        <hr class="blog-post-header-hr">
                    </div>
                    <div class="blog-post-body">${marked.parse(md)}</div>
                `;

            const titleEl = document.getElementById('post-title-bar');
            if (titleEl) maybeMarquee(titleEl, title);
        })
        .catch(() => {
            content.innerHTML = '<p style="color:#888;font-size:14px;">could not load post.,</p>';
        });
}