window.includesReady = false;
window.includesQueue = window.includesQueue || [];

document.addEventListener("DOMContentLoaded", async () => {
    const includes = document.querySelectorAll("include[src]");

    for (const el of includes) {
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

    document.dispatchEvent(new Event("includesLoaded"));
});//this is so ass but i mean it SORTA works LMFAO