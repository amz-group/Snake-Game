const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const overlay = document.getElementById("overlay");
const statusText = document.getElementById("status-text");

const grid = 20;
const count = canvas.width / grid;

let snake, food, dx, dy, score, gameActive;

function resetVariables() {
    snake = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
    food = { x: 5, y: 5 };
    dx = 0; dy = -1;
    score = 0;
    scoreEl.innerText = score;
    gameActive = false;
}

function startGame() {
    resetVariables();
    overlay.style.display = "none";
    gameActive = true;
    gameLoop();
}

function gameLoop() {
    if (!gameActive) return;

    setTimeout(() => {
        clear();
        drawFood();
        moveSnake();
        drawSnake();
        if (checkCollision()) {
            endGame();
        } else {
            gameLoop();
        }
    }, 150);
}

function clear() {
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach((part, i) => {
        ctx.fillStyle = i === 0 ? "#22d3ee" : "#0891b2";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#22d3ee";
        ctx.fillRect(part.x * grid, part.y * grid, grid - 2, grid - 2);
        ctx.shadowBlur = 0; // Reset for performance
    });
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.innerText = score;
        spawnFood();
    } else {
        snake.pop();
    }
}

function drawFood() {
    ctx.fillStyle = "#f43f5e";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#f43f5e";
    ctx.beginPath();
    ctx.arc(food.x * grid + grid / 2, food.y * grid + grid / 2, grid / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function spawnFood() {
    food.x = Math.floor(Math.random() * count);
    food.y = Math.floor(Math.random() * count);
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= count || head.y < 0 || head.y >= count) return true;
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) return true;
    }
    return false;
}

function endGame() {
    gameActive = false;
    statusText.innerText = "GAME OVER";
    overlay.style.display = "flex";
}

function changeDir(key) {
    if (key === 'ArrowUp' && dy === 0) { dx = 0; dy = -1; }
    if (key === 'ArrowDown' && dy === 0) { dx = 0; dy = 1; }
    if (key === 'ArrowLeft' && dx === 0) { dx = -1; dy = 0; }
    if (key === 'ArrowRight' && dx === 0) { dx = 1; dy = 0; }
}

window.addEventListener("keydown", e => changeDir(e.key));

// Swipe Logic
let tsX, tsY;
canvas.addEventListener('touchstart', e => { tsX = e.touches[0].clientX; tsY = e.touches[0].clientY; });
canvas.addEventListener('touchend', e => {
    let teX = e.changedTouches[0].clientX;
    let teY = e.changedTouches[0].clientY;
    let dX = teX - tsX; let dY = teY - tsY;
    if (Math.abs(dX) > Math.abs(dY)) {
        changeDir(dX > 0 ? 'ArrowRight' : 'ArrowLeft');
    } else {
        changeDir(dY > 0 ? 'ArrowDown' : 'ArrowUp');
    }
});

resetVariables();
clear();
drawSnake();
