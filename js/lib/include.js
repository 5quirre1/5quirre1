window.includesReady = false;
window.includesQueue = window.includesQueue || [];

document.addEventListener("DOMContentLoaded", async () => {
    async function processIncludes(root = document) {
        const includes = root.querySelectorAll("include[src]");
        let found = false;

        for (const el of includes) {
            found = true;

            const src = el.getAttribute("src");
            if (!src) continue;

            try {
                const res = await fetch(src);
                if (!res.ok) throw new Error();
                const html = await res.text();

                const template = document.createElement("template");
                template.innerHTML = html;

                el.replaceWith(template.content.cloneNode(true));
            } catch (err) {
                console.error(err);
                el.replaceWith(document.createTextNode(`failed to load: ${src}`));
            }
        }

        if (found) {
            await processIncludes(document);
        }
    }

    await processIncludes();

    window.includesReady = true;
    document.dispatchEvent(new Event("includesLoaded"));
});