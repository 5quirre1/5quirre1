async function loadStatCaf() {
    const url = "https://status.cafe/users/squirrel.atom";

    try {
        const res = await fetch(url);
        const text = await res.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "application/xml");
        //all stuff
        const pfpUrl = xml.querySelector("icon")?.textContent;
        const entry = xml.querySelector("entry");
        if (!entry) return;
        const content = entry.querySelector("content")?.textContent || "(no status)";
        const published = entry.querySelector("published")?.textContent;
        const msgEl = document.querySelector(".status-message");
        if (msgEl) msgEl.textContent = content;
        const pfp = document.querySelector(".pfp");
        if (pfp && pfpUrl) pfp.src = pfpUrl;

        if (published) {
            const d = new Date(published);
            const dateEl = document.querySelector(".status-date");
            if (dateEl) {
                dateEl.textContent = d.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                });

                dateEl.title = d.toLocaleString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true
                });
            }
        }
    } catch (err) {
        console.error(err);
    }
}
loadStatCaf();
