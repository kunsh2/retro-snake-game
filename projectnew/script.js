function endGame() {
    clearInterval(gameInterval);
    gameStarted = false;

    if (isSoundOn) {
        const gameOverSound = new Audio('gameover.mp3');
        gameOverSound.play();
    }

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById('highScore').innerText = highScore;
    }

    setTimeout(() => {
        alert('Game Over! Your score: ' + score);
    }, 500);

    if (!document.getElementById('returnButton')) {
        const returnButton = document.createElement('button');
        returnButton.id = 'returnButton';
        returnButton.innerText = "Return to Home";
        returnButton.onclick = function() {
            window.location.href = "index.html"; 
        };
        document.body.appendChild(returnButton);
    }
}

// The rest of your code remains unchanged...

let currentTheme = localStorage.getItem('currentTheme') || 'theme-green';
let isSoundOn = localStorage.getItem('isSoundOn') === 'true';
let isMusicOn = localStorage.getItem('isMusicOn') === 'true';
let difficulty = 'normal';
let canvas;
let ctx;
let snake = [{ x: 10, y: 10 }];
let snakeDirection = { x: 1, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;
let highScore = 0;
let timer = 0;
let gameInterval;
let gameStarted = false;

window.onload = function () {
    applyTheme();
    updateSoundButton();
    updateMusicButton();
    const musicElement = document.getElementById('musicElement');
    if (isMusicOn) {
        musicElement.play();
    }

    if (document.getElementById('gameCanvas')) {
        canvas = document.getElementById('gameCanvas');
        ctx = canvas.getContext('2d');
    }

    difficulty = localStorage.getItem('selectedDifficulty') || 'normal';
    highScore = parseInt(localStorage.getItem('highScore')) || 0;
    document.getElementById('highScore').innerText = highScore;
};

function goToSecondPage() {
    window.location.href = "difficulty.html";
}

function toggleTheme() {
    currentTheme = currentTheme === 'theme-green' ? 'theme-blue' : currentTheme === 'theme-blue' ? 'theme-purple' : 'theme-green';
    applyTheme();
    localStorage.setItem('currentTheme', currentTheme);
}

function applyTheme() {
    document.body.className = currentTheme;

    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.style.borderColor = currentTheme === 'theme-green' ? '#FFEA00' : 
                                   currentTheme === 'theme-blue' ? 'blue' : 
                                   'purple';
    });

    const imageContainer = document.querySelector('.image-container');
    if (imageContainer) {
        imageContainer.style.borderColor = currentTheme.replace('theme-', '');
    }
}

function playButtonClickSound() {
    if (isSoundOn) {
        const sound = new Audio('buttonclick.mp3');
        sound.play();
    }
}

function playEatSound() {
    if (isSoundOn) {
        const sound = new Audio('eat.mp3');
        sound.play();
    }
}

function toggleSound() {
    isSoundOn = !isSoundOn;
    localStorage.setItem('isSoundOn', isSoundOn);
    updateSoundButton();
}

function toggleMusic() {
    const musicElement = document.getElementById('musicElement');
    isMusicOn = !isMusicOn;
    localStorage.setItem('isMusicOn', isMusicOn);
    updateMusicButton();
    if (isMusicOn) {
        musicElement.play();
    } else {
        musicElement.pause();
    }
}

function updateSoundButton() {
    const soundButton = document.querySelector('.sound-button');
    soundButton.style.backgroundColor = isSoundOn ? 'green' : 'red';
}

function updateMusicButton() {
    const musicButton = document.querySelector('.music-button');
    musicButton.style.backgroundColor = isMusicOn ? 'green' : 'red';
}

function setDifficulty(level) {
    difficulty = level;
    localStorage.setItem('selectedDifficulty', difficulty);
    goToGamePage();
}

function goToGamePage() {
    window.location.href = "game.html";
}

function startGame() {
    if (gameStarted) {
        alert("Game is already in progress!");
        return;
    }
    gameStarted = true;
    score = 0;
    snake = [{ x: 10, y: 10 }];
    placeFood();
    
    let elapsedTime = 0;
    document.getElementById('timer').innerText = 0;

    let speed;
    switch (difficulty) {
        case 'easy':
            speed = 300;
            break;
        case 'normal':
            speed = 150;
            break;
        case 'hard':
            speed = 75;
            break;
        default:
            speed = 150;
    }

    gameInterval = setInterval(() => {
        update();
        draw();
        elapsedTime += speed;
        document.getElementById('timer').innerText = Math.floor(elapsedTime / 1000);
    }, speed);
}

function update() {
    const head = { x: snake[0].x + snakeDirection.x, y: snake[0].y + snakeDirection.y };

    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('score').innerText = score;
        playEatSound();
        placeFood();
    } else {
        snake.pop();
    }

    snake.unshift(head);
    checkCollision(head);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = getSnakeColor();
    snake.forEach(part => {
        ctx.fillRect(part.x * 20, part.y * 20, 18, 18);
    });

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * 20, food.y * 20, 18, 18);
}

function getSnakeColor() {
    if (document.body.classList.contains('theme-green')) return '#39FF14';
    if (document.body.classList.contains('theme-blue')) return 'blue';
    if (document.body.classList.contains('theme-purple')) return 'purple';
    return 'black';
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / 20)),
        y: Math.floor(Math.random() * (canvas.height / 20))
    };
}

function checkCollision(head) {
    if (head.x < 0 || head.x >= canvas.width / 20 || head.y < 0 || head.y >= canvas.height / 20) {
        endGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
        }
    }
}

document.addEventListener('keydown', (event) => {
    if (!gameStarted) return;

    if (event.key === 'ArrowUp' && snakeDirection.y !== 1) {
        snakeDirection = { x: 0, y: -1 };
    } else if (event.key === 'ArrowDown' && snakeDirection.y !== -1) {
        snakeDirection = { x: 0, y: 1 };
    } else if (event.key === 'ArrowLeft' && snakeDirection.x !== 1) {
        snakeDirection = { x: -1, y: 0 };
    } else if (event.key === 'ArrowRight' && snakeDirection.x !== -1) {
        snakeDirection = { x: 1, y: 0 };
    }
});
