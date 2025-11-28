function upTheTitle() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const currentTime = `${hours}:${minutes}:${seconds} ${ampm}`;
    const timeWindowTitle = document.querySelector('.window .title-bar-text span#my-time');
    if (timeWindowTitle) {
        timeWindowTitle.textContent = currentTime;
    }
}

function christmas() {
    const now = new Date();
    const year = now.getFullYear();
    const christmas = new Date(year, 11, 25);
    const titleNumber = document.getElementById('christmas-title-number');

    if (now.getMonth() === 11 && now.getDate() === 25) {
        document.getElementById("christmas-number").textContent = "Merry Christmas!!!";
        document.querySelector("#christmas-countdown span:nth-child(2)").style.display = "none";
        if (titleNumber) titleNumber.textContent = "Merry Christmas!!!";
        return;
    }

    let nextChristmas = christmas;
    if (now > christmas) {
        nextChristmas = new Date(year + 1, 11, 25);
    }

    const diff = nextChristmas - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    document.getElementById("christmas-number").textContent = days;
    document.querySelector("#christmas-countdown span:nth-child(2)").style.display = "block";
    if (titleNumber) titleNumber.textContent = days;
}

function updateEverything() {
    upTheTitle();
    christmas();
}

updateEverything();
setInterval(updateEverything, 1000);

