const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreVal');

const screenElement = document.documentElement; // Targets the whole screen (HTML element)

canvas.width = 800;
canvas.height = 200;

// Game State
let score = 0;
let isGameOver = false;
let gameOverSpeed = 0;
let originalGameSpeed = -5;
let gameSpeed = originalGameSpeed;

let newObstacleTime = Math.floor((Math.random()*1500)+1500-score);

let lastTime = 0;
let obstacleTimer = 0;
//const obstacleInterval = 1500; // Spawn every 1500ms (1.5 seconds)

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
        if (score > 9) {
            carImg.src = 'corvette_black.JPG';
            ctx.drawImage(carImg, this.x, this.y, this.w, this.h);
        }
        else if (score > 5) {
            carImg.src = 'corvette_v5.jpg';
            ctx.drawImage(carImg, this.x, this.y, this.w, this.h);
        } 
        else if (score > 2) {
            carImg.src = 'corvette_v2.jpg';
            ctx.drawImage(carImg, this.x, this.y, this.w, this.h);
        }
        else {
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

screenElement.addEventListener("touchstart", (e) => {
    if (player.grounded) {
        player.dy = -player.jumpForce;
        player.grounded = false;
    }
    if (isGameOver) restartGame();
});
                               
/*
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
            newObstacleTime = Math.floor((Math.random()*50)+150-score);
            scoreElement.innerText = score;
            if (score === 3) {
                gameSpeed = originalGameSpeed-1;
            }
            if (score === 6) {
                gameSpeed = originalGameSpeed-2;
            }
            if (score > 9) {
                gameSpeed = originalGameSpeed-score/3;
            }
            //if (score % 3 === 0) gameSpeed -= 0.01*score; // Increase difficulty
        }
    });
}
*/

function update(dt) {
    if (isGameOver) return;

    // Use a multiplier (dt / 16) so "16ms" (60fps) is our base speed
    const timeScale = dt / 16.67;

    // Player Physics adjusted for time
    player.dy += player.gravity * timeScale;
    player.y += player.dy * timeScale;

    // Ground Collision
    if (player.y + player.h > canvas.height) {
        player.y = canvas.height - player.h;
        player.dy = 0;
        player.grounded = true;
    }

    // Move Obstacles adjusted for time
    obstacles.forEach((obs, index) => {
        obs.x -= gameSpeed * timeScale;

        // Collision Detection
        if (player.x < obs.x + obs.w &&
            player.x + player.w > obs.x &&
            player.y < obs.y + obs.h &&
            player.y + player.h > obs.y) {
            isGameOver = true;
        }

        if (obs.x + obs.w > canvas.width) {
            obstacles.splice(index, 1);
            score++;
            let newObstacleTime = Math.floor((Math.random()*1500)+1500-score);
            scoreElement.innerText = score;
            if (score === 3) {
                gameSpeed = originalGameSpeed-1;
            }
            if (score === 6) {
                gameSpeed = originalGameSpeed-2;
            }
            if (score > 9) {
                gameSpeed = originalGameSpeed-score/3;
            }
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

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}




function loop(timestamp) {
    // Calculate how many ms have passed since last frame
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // Avoid massive jumps if the user switches tabs
    if (deltaTime > 100) deltaTime = 16; 

    update(deltaTime);
    draw();
    
    // Spawn obstacles based on real time, not frames
    obstacleTimer += deltaTime;
    if (obstacleTimer > obstacleInterval) {
        spawnObstacle();
        obstacleTimer = 0;
    }
    
    requestAnimationFrame(loop);
}

// Main Loop
/*
let timer = 0;
function loop() {
    update();
    draw();

    //await delay(1)
    timer++;
    if (timer % newObstacleTime === 0) spawnObstacle();
    
    requestAnimationFrame(loop);
}
*/

function restartGame() {
    score = 0;
    gameSpeed = originalGameSpeed;
    obstacles.length = 0;
    isGameOver = false;
    scoreElement.innerText = 0;
}

loop(lastTime);
