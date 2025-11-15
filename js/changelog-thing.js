const changelogWindow = document.querySelector('.changelog-window');
const windowBody = changelogWindow.querySelector('.window-body');
const minimizeBtn = changelogWindow.querySelector('.minimize-btn');
const previewHeight = 150;
const maxBodyHeight = 320;

function updateChangelogActive() {
    if (windowBody.scrollHeight > previewHeight) {
        changelogWindow.classList.add('active');
        if (!changelogWindow.classList.contains('minimized')) {
            windowBody.style.maxHeight = maxBodyHeight + 'px';
            windowBody.style.overflowY = 'auto';
        }
    } else {
        changelogWindow.classList.remove('active');
        changelogWindow.classList.remove('minimized');
        windowBody.style.maxHeight = previewHeight + 'px';
        windowBody.style.overflow = 'hidden';
    }
}

updateChangelogActive();

const observer = new MutationObserver(updateChangelogActive);
observer.observe(windowBody, { childList: true, subtree: true });

minimizeBtn.addEventListener('click', () => {
    if (changelogWindow.classList.contains('active')) {
        changelogWindow.classList.toggle('minimized');
        if (changelogWindow.classList.contains('minimized')) {
            windowBody.style.maxHeight = previewHeight + 'px';
            windowBody.style.overflow = 'hidden';
        } else {
            windowBody.style.maxHeight = maxBodyHeight + 'px';
            windowBody.style.overflowY = 'auto';
        }
    }
});
