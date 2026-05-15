const link = document.getElementById('monkeyLink');
const quizYN = document.getElementById('quizYN');
const quizInput = document.getElementById('quizInput');
const quizAnswer = document.getElementById('quizAnswer');

const steps = [
    'i understand. show me the monkeys.',
    'are you sure dude???',
    'are you REALLY sure???',
    'did you actually read what\'s going to happen',
    'ok one more time.',
];
let step = 0;

function resetToStart() {
    step = 0;
    link.textContent = steps[0];
    quizYN.classList.remove('visible');
    quizInput.classList.remove('visible');
    quizAnswer.value = '';
}

link.addEventListener('click', () => {
    if (quizYN.classList.contains('visible') || quizInput.classList.contains('visible')) return;
    step++;
    if (step === 3) {
        link.textContent = steps[3];
        quizYN.classList.add('visible');
    } else if (step < steps.length) {
        link.textContent = steps[step];
    } else {
        window.location.href = '/misc/15millionmonkeys/15millionmonkeys.html';
    }
});

document.getElementById('quizYes').addEventListener('click', () => {
    quizYN.classList.remove('visible');
    link.textContent = 'what\'s going to happen?';
    quizInput.classList.add('visible');
    quizAnswer.focus();
});

document.getElementById('quizNo').addEventListener('click', () => {
    quizYN.classList.remove('visible');
    link.textContent = 'dumbass.';
    setTimeout(resetToStart, 1200);
});

function handleAnswer() {
    const val = quizAnswer.value.trim().toLowerCase();
    if (val.includes('15 million') || val.includes('15million') || val.includes('monkeys')) {
        quizInput.classList.remove('visible');
        step = 4;
        link.textContent = steps[4];
        quizAnswer.value = '';
    } else {
        quizInput.classList.remove('visible');
        link.textContent = 'dumbass.';
        setTimeout(resetToStart, 1200);
    }
}

document.getElementById('quizSubmit').addEventListener('click', handleAnswer);
quizAnswer.addEventListener('keydown', e => { if (e.key === 'Enter') handleAnswer(); });