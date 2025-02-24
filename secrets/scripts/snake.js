const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const box = 20;
        const startScreen = document.getElementById('start-screen');
        const gameOverScreen = document.getElementById('game-over');
        const scoreDisplay = document.getElementById('score-display');
        const currentScoreElement = document.getElementById('current-score');
        const highestScoreElement = document.getElementById('highest-score');
        let snake = [{ x: 9 * box, y: 10 * box }];
        let food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
        let direction = "RIGHT";
        let score = 0;
        let gameInterval;
        let highestScore = localStorage.getItem('highestScore') ? parseInt(localStorage.getItem('highestScore')) : 0;
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;
        let difficulty = '';

        document.addEventListener('keydown', event => {
            if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
            if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
            if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
            if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
        });

        function handleTouchStart(event) {
            const touch = event.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            touchStartTime = Date.now();
        }

        function handleTouchMove(event) {
            if (event.touches.length === 1) {
                const touch = event.touches[0];
                const deltaX = touch.clientX - touchStartX;
                const deltaY = touch.clientY - touchStartY;

                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (deltaX > 0 && direction !== 'LEFT') direction = 'RIGHT';
                    if (deltaX < 0 && direction !== 'RIGHT') direction = 'LEFT';
                } else {
                    if (deltaY > 0 && direction !== 'UP') direction = 'DOWN';
                    if (deltaY < 0 && direction !== 'DOWN') direction = 'UP';
                }
                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
            }
        }

        function handleTouchEnd(event) {
            const touchDuration = Date.now() - touchStartTime;
            if (touchDuration < 200) {
                event.preventDefault();
            }
        }

        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('touchmove', handleTouchMove);
        canvas.addEventListener('touchend', handleTouchEnd);

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'red';
            ctx.fillRect(food.x, food.y, box, box);
            ctx.fillStyle = 'lime';
            snake.forEach(segment => ctx.fillRect(segment.x, segment.y, box, box));
            let headX = snake[0].x;
            let headY = snake[0].y;
            if (direction === 'UP') headY -= box;
            if (direction === 'DOWN') headY += box;
            if (direction === 'LEFT') headX -= box;
            if (direction === 'RIGHT') headX += box;
            if (headX < 0 || headX >= canvas.width || headY < 0 || headY >= canvas.height || collision(headX, headY, snake)) {
                clearInterval(gameInterval);
                gameOver();
                return;
            }
            if (headX === food.x && headY === food.y) {
                food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
                score++;
                currentScoreElement.textContent = score;
                document.getElementById('foodSound').play();
            } else {
                snake.pop();
            }
            snake.unshift({ x: headX, y: headY });
        }

        function collision(x, y, array) {
            return array.some(segment => segment.x === x && segment.y === y);
        }

        const deathSounds = [
            new Audio('/secrets/assets/snake/death_sound1.mp3'),
            new Audio('/secrets/assets/snake/death_sound2.mp3'),
            new Audio('/secrets/assets/snake/death_sound3.mp3'),
            new Audio('/secrets/assets/snake/death_sound4.mp3'),
            new Audio('/secrets/assets/snake/death_sound5.mp3'),
            new Audio('/secrets/assets/snake/death_sound6.mp3'),
            new Audio('/secrets/assets/snake/death_sound7.mp3'),
            new Audio('/secrets/assets/snake/death_sound8.mp3'),
        ];

        let currentDeathSound = null;
        let previousIndex = -1;

        function playRandomDeathSound() {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * deathSounds.length);
            } while (randomIndex === previousIndex);
            previousIndex = randomIndex;

            currentDeathSound = deathSounds[randomIndex];
            currentDeathSound.currentTime = 0;
            currentDeathSound.play();
        }

        function stopDeathSound() {
            if (currentDeathSound) {
                currentDeathSound.pause();
                currentDeathSound.currentTime = 0;
                currentDeathSound = null;
            }
        }

        function gameOver() {
            scoreDisplay.style.display = 'none';
            gameOverScreen.style.display = 'block';
            document.getElementById('score').textContent = score;
            if (score > highestScore) {
                highestScore = score;
                localStorage.setItem('highestScore', highestScore);
            }
            highestScoreElement.textContent = highestScore;
            playRandomDeathSound();
        }

        function showDifficulty() {
            startScreen.style.display = 'none';
            document.querySelector('.difficulty-select').style.display = 'block';
        }

        function setDifficulty(difficulty_choice) {
            difficulty = difficulty_choice;
            document.querySelector('.difficulty-select').style.display = 'none';
            startGame();
        }

        function startGame() {
            stopDeathSound();
            gameOverScreen.style.display = 'none';
            scoreDisplay.style.display = 'block';
            score = 0;
            currentScoreElement.textContent = score;
            snake = [{ x: 9 * box, y: 10 * box }];
            food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
            direction = "RIGHT";
            gameInterval = setInterval(draw, difficulty === 'easy' ? 115 : difficulty === 'medium' ? 95 : difficulty === 'hard' ? 75 : difficulty === 'Nightmare' ? 40 : 60);
        }
        function restartGame() {
            showDifficulty();
        }

        window.onload = function () {
            startScreen.style.display = 'block';
        };