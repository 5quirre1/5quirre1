//https://www.mf2fm.com/rv/dhtmlrolltext.php
const text = [
    "happy pride month!!",
    "2025-FOREVER squirrelz.xyz",
    `built with love <img src="/assets/icons/red-heart-normal.png" style="width:10px;height:10px;vertical-align:middle;position:relative;top:-1px;">`
];

const delay = 10000;
const speed = 50;

let diddly = [];
let rolltop = 0;
let referee = 0;

function initRollingText() {
    const r = document.getElementById("rolling");
    if (!r) return;

    rolltop = r.clientHeight;

    while (r.childNodes.length) r.removeChild(r.childNodes[0]);
    r.style.position = "relative";
    r.style.overflow = "hidden";
    r.appendChild(document.createTextNode('\u00a0'));

    for (let i = 0; i < text.length; i++) {
        const d = document.createElement("div");
        d.style.position = "absolute";
        d.style.top = rolltop + "px";
        d.style.left = "0px";
        d.style.whiteSpace = "nowrap";
        d.innerHTML = text[i];
        r.appendChild(d);
        diddly.push(d);
    }

    rolling();
}

function rolling() {
    const j = referee % text.length;

    for (let i = rolltop; i >= 0; i--)
        setTimeout(((pos) => () => { diddly[j].style.top = pos + "px"; })(i), speed * (rolltop - i));

    for (let i = -1; i > -rolltop; i--)
        setTimeout(((pos) => () => { diddly[j].style.top = pos + "px"; })(i), delay - speed * i);

    referee++;
    setTimeout(rolling, delay);
}

document.addEventListener("includesLoaded", initRollingText);

//just gonna put this here cause i'm too lazy to put the script tag in every file LOL
document.addEventListener(
    "error",
    (e) => {
        const img = e.target;

        if (
            img.tagName !== "IMG" ||
            !img.closest(".buttons") ||
            img.dataset.errorHandled
        ) {
            return;
        }

        img.dataset.errorHandled = "true";

        img.src =
            "data:image/svg+xml," +
            encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="88" height="31">
                    <rect width="88" height="31" fill="white"/>

                    <rect
                        x="0.5"
                        y="0.5"
                        width="87"
                        height="30"
                        fill="none"
                        stroke="#eee"
                        stroke-width="1"
                    />

                    <text
                        x="44"
                        y="19"
                        font-family="sans-serif"
                        font-size="10"
                        fill="black"
                        text-anchor="middle"
                    >
                        no image (404)
                    </text>
                </svg>
            `);

        img.alt = "no image (404)";
    },
    true
);