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

setInterval(upTheTitle, 1000);
upTheTitle();