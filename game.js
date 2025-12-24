const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreVal');

canvas.width = 800;
canvas.height = 200;

// Game State
let score = 0;
let isGameOver = false;
let gameOverSpeed = 0;
let originalGameSpeed = -5;
let gameSpeed = originalGameSpeed;

// Load the car image
const carImg = new Image();
carImg.src = 'corvette_v2.jpg'; // Make sure the file name matches your saved image

const car_width = 80;
const player = {
    x: canvas.width - 2*car_width,
    y: 150,
    w: car_width,  // Adjusted width for a car shape
    h: 40,  // Adjusted height
    dy: 0,
    jumpForce: 12,
    gravity: 0.6,
    grounded: false,
    draw() {
        if (score > 2) {
            carImg.src = 'corvette_v2.jpg';
            if (score > 5) {
                carImg.src = 'corvette_v5.jpg';
            } else if (score > 9) {
                carImg.src = 'corvette_v5.png';
            } else if (score > 14) {
                carImg.src = 'corvette_v5p2.png';
            }
            // Draws the image at the player's position and size
            ctx.drawImage(carImg, this.x, this.y, this.w, this.h);
        } else {
            // Fallback to a block while loading
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y, this.w, this.h);
        }
    }
};

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw "Road" lines
    ctx.strokeStyle = "white";
    ctx.setLineDash([20, 20]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 5);
    ctx.lineTo(canvas.width, canvas.height - 5);
    ctx.stroke();

    player.draw();
    
    // Draw Obstacles
    ctx.fillStyle = '#f1c40f'; // Bright yellow hazards
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
    });

    if (isGameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        gameSpeed = gameOverSpeed;
        ctx.fillText("CRASHED! Press Space to Restart", canvas.width/2 - 150, canvas.height/2);
    }
}

// // Player Object
// const player = {
//     x: 50,
//     y: 150,
//     w: 40,
//     h: 40,
//     dy: 0,
//     jumpForce: 12,
//     gravity: 0.6,
//     grounded: false,
//     draw() {
//         ctx.fillStyle = '#ff4757';
//         ctx.fillRect(this.x, this.y, this.w, this.h);
//     }
// };

// Obstacle Logic
const obstacles = [];
function spawnObstacle() {
    let size = Math.random() * (50 - 20) + 20;
    obstacles.push({
        x: 0,
        y: canvas.height - size,
        w: 20,
        h: size
    });
}

// Input Handling
window.addEventListener('keydown', (e) => {
    if (e.code === "Space" && player.grounded) {
        player.dy = -player.jumpForce;
        player.grounded = false;
    }
    if (isGameOver && e.code === "Space") restartGame();
});

function update() {
    if (isGameOver) return;

    // Player Physics
    player.dy += player.gravity;
    player.y += player.dy;

    // Ground Collision
    if (player.y + player.h > canvas.height) {
        player.y = canvas.height - player.h;
        player.dy = 0;
        player.grounded = true;
    }

    // Move Obstacles
    obstacles.forEach((obs, index) => {
        obs.x -= gameSpeed;

        // Collision Detection
        if (player.x < obs.x + obs.w &&
            player.x + player.w > obs.x &&
            player.y < obs.y + obs.h &&
            player.y + player.h > obs.y) {
            isGameOver = true;
        }

        // Remove off-screen obstacles
        // if (obs.x + obs.w < 0) {
        if (obs.x + obs.w > canvas.width) {
            obstacles.splice(index, 1);
            score++;
            scoreElement.innerText = score;
            if (score % 5 === 0) gameSpeed -= 0.2; // Increase difficulty
        }
    });
}

// function draw() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     player.draw();
    
//     ctx.fillStyle = '#2f3542';
//     obstacles.forEach(obs => {
//         ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
//     });

//     if (isGameOver) {
//         ctx.fillStyle = "rgba(0,0,0,0.5)";
//         ctx.fillRect(0,0, canvas.width, canvas.height);
//         ctx.fillStyle = "white";
//         ctx.fillText("GAME OVER - Press Space to Restart", canvas.width/2 - 100, canvas.height/2);
//     }
// }

// Main Loop
let timer = 0;
function loop() {
    update();
    draw();
    
    timer++;
    if (timer % 100 === 0) spawnObstacle();
    
    requestAnimationFrame(loop);
}

function restartGame() {
    score = 0;
    gameSpeed = originalGameSpeed;
    obstacles.length = 0;
    isGameOver = false;
    scoreElement.innerText = 0;
}

loop();
