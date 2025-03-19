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
function updateClock() {
    const now = new Date();
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const time = now.toLocaleTimeString();
    const date = now.toLocaleDateString(undefined, options);

    document.getElementById('clock').textContent = `${date} | ${time}`;

    const holidays = {
        'Dec 25': 'MERRY CHRISTMAS!!!',
        'Jan 1': 'HAPPY NEW YEAR!!!',
        'Feb 14': 'HAPPY VALENTINE\'S DAY!!!',
        'Mar 17': 'HAPPY ST. PATRICK\'S DAY!!!',
        'Apr 1': 'HAPPY APRIL FOOL\'S DAY!!!',
        'May 25': 'HAPPY MEMORIAL DAY!!!',
        'Jul 4': 'HAPPY INDEPENDENCE DAY!!!',
        'Oct 31': 'HAPPY HALLOWEEN!!!',
        'Nov 11': 'HAPPY VETERANS DAY!!!',
        'Nov 22': 'HAPPY THANKSGIVING!!!',

    };

    const monthDay = date.split(', ')[1];
    const hour = now.getHours();
    if (holidays[monthDay] && (hour >= 0 && hour < 2)) {
        document.getElementById('clock').textContent = holidays[monthDay];
    }
}

setInterval(updateClock, 1000);
updateClock();
