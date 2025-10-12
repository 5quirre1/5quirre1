function updateTime() {
    const options = {
        timeZone: "America/Los_Angeles",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    };
    document.getElementById("local-time").textContent =
        new Date().toLocaleTimeString("en-US", options);
}
setInterval(updateTime, 1000);
updateTime();
