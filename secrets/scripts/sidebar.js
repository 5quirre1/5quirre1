function toggleMenu() {
    var sidebar = document.getElementById("sidebar");

    if (sidebar.style.left === "0px") {
        sidebar.style.left = "-250px";
        sidebar.style.pointerEvents = "none";
    } else {
        sidebar.style.left = "0";
        sidebar.style.pointerEvents = "auto";
    }
}