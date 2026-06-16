async function loadChangelog() {
    const res = await fetch("assets/data/changelog.md");
    const md = await res.text();

    const el = document.getElementById("changelog-content");
    if (!el) return;

    const lines = md.split("\n");

    const entries = [];
    let current = null;

    for (let line of lines) {
        line = line.trimEnd();

        const headerMatch = line.match(/^##\s*(.+)$/);

        if (headerMatch) {
            if (current) entries.push(current);

            current = {
                date: headerMatch[1].trim(),
                content: ""
            };

            continue;
        }

        if (!current) continue;

        current.content += line + "\n";
    }

    if (current) entries.push(current);

    entries.sort((a, b) => new Date(b.date) - new Date(a.date));

    el.innerHTML =
        entries.map((e, i) => {
            const text = marked.parseInline(e.content.trim());

            return `
                <div class="changelog-line ${i === 0 ? "latest" : ""}">
                    <img class="changelog-icon" src="assets/icons/new2.png">
                    <span><strong>${e.date}</strong> | ${text}</span>
                </div>
            `;
        }).join("") +
        `
            <div class="changelog-end">
                that's it!
            </div>
        `;
}

document.addEventListener("includesLoaded", loadChangelog);