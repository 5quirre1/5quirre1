window.includesReady = false;
window.includesQueue = window.includesQueue || [];

document.addEventListener("DOMContentLoaded", async () => {
    async function processIncludes(root = document) {
        let includes = Array.from(root.querySelectorAll("include[src]"));

        while (includes.length > 0) {
            for (const el of includes) {
                const src = el.getAttribute("src");
                if (!src) continue;

                try {
                    const res = await fetch(src);
                    if (!res.ok) throw new Error(`Failed to load ${src}`);

                    const html = await res.text();

                    const template = document.createElement("template");
                    template.innerHTML = html.trim();

                    el.replaceWith(template.content.cloneNode(true));
                } catch (err) {
                    console.error(err);
                    el.replaceWith(document.createTextNode(`failed to load: ${src}`));
                }
            }

            includes = Array.from(document.querySelectorAll("include[src]"));
        }
    }

    await processIncludes();

    window.includesReady = true;
    document.dispatchEvent(new Event("includesLoaded"));

    while (window.includesQueue.length) {
        const fn = window.includesQueue.shift();
        try {
            fn();
        } catch (e) {
            console.error(e);
        }
    }
});