//https://www.mf2fm.com/rv/dhtmlrolltext.php
const text = [
    "&copy;2026 squirrelz.xyz - all rights reserved",
    `built with love <img src="assets/icons/red-heart-normal.png" style="width:10px;height:10px;vertical-align:middle;position:relative;top:-1px;">`
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