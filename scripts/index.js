function generateRandomPassword(length = 12) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

const openModalBtn = document.getElementById('openModalBtn');
const modal = document.getElementById('modal');
const submitBtn = document.getElementById('submitBtn');
const phraseInput = document.getElementById('phraseInput');
const errorMessage = document.getElementById('errorMessage');

openModalBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        errorMessage.textContent = '';
    }
});

phraseInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        submitBtn.click();
    }
});

submitBtn.addEventListener('click', () => {
    let phrase = phraseInput.value.trim();
    if (!phrase) {
        errorMessage.textContent = 'Make sure to type something :P';
        return;
    }
    if (phrase.toLowerCase() === "password") {
        phrase = generateRandomPassword();
        errorMessage.textContent = `Hai! Here's your password: ${phrase}!`;
        phraseInput.value = '';
        return;
    }

    const sanitizedPhrase = phrase.replace(/\s+/g, '_').toLowerCase();
    fetch(`/secrets/${sanitizedPhrase}.html`, { method: 'HEAD' })
        .then((response) => {
            if (response.ok) {
                errorMessage.textContent = 'Page found! Redirecting shortly...';
                setTimeout(() => {
                    window.location.href = `/secrets/${sanitizedPhrase}.html`;
                }, 2000);
            } else {
                const suggestion = getClosestMatch(sanitizedPhrase);
                errorMessage.textContent = suggestion
                    ? `That was not found... maybe you were wanting to say "${suggestion}"  !! `
                    : 'That doesn\'t exist, sorry :c';
            }
        })
        .catch(() => {
            errorMessage.textContent = 'That doesn\'t exist, sorry :c';
        });
});

function getClosestMatch(input) {
    const knownCodes = ['in_the_end', 'greg', 'skibidi', 'king_von_anti_piracy', 'snake', 'king_von', 'go'];
    let closestMatch = null;
    let minDistance = Infinity;

    for (const code of knownCodes) {
        const distance = getLevenshteinDistance(input, code);
        if (distance < minDistance) {
            minDistance = distance;
            closestMatch = code;
        }
    }

    return minDistance <= 3 ? closestMatch : null;
}

function getLevenshteinDistance(a, b) {
    const tmp = [];
    for (let i = 0; i <= a.length; i++) {
        tmp[i] = [i];
    }

    for (let j = 0; j <= b.length; j++) {
        tmp[0][j] = j;
    }

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            tmp[i][j] = Math.min(
                tmp[i - 1][j] + 1,
                tmp[i][j - 1] + 1,
                tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
            );
        }
    }

    return tmp[a.length][b.length];
}

function toggleMenu() {
    var menu = document.getElementById("menu");
    
    if (menu.style.display === "block") {
        menu.style.transform = "translateX(-100%)";
        setTimeout(function() {
            menu.style.display = "none";
        }, 400);
    } else {
        menu.style.display = "block";
        setTimeout(function() {
            menu.style.transform = "translateX(0)";
        }, 10);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    var menuButton = document.getElementById("menuButton");
    if (menuButton) {
        menuButton.addEventListener("click", toggleMenu);
    }
    
    updateClock();
    setInterval(updateClock, 1000);
});

function updateClock() {
    var clockElement = document.getElementById("clock");
    if (clockElement) {
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        
        var timeString = hours + ':' + minutes + ' ' + ampm;
        clockElement.textContent = timeString;
    }
}
