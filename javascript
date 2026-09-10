const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");
const messageElement = document.getElementById("message");
const restartButton = document.getElementById("restartButton");

// ===============================
// CONFIGURACIÓN
// ===============================

const TILE = 40;

const map = [
    "################",
    "#..............#",
    "#.####.##.####.#",
    "#..............#",
    "#.##.#.##.#.##.#",
    "#....#....#....#",
    "####.#....#.####",
    "####.#....#.####",
    "#..............#",
    "#.##.#.##.#.##.#",
    "#....#....#....#",
    "#.####.##.####.#",
    "#..............#",
    "################"
];

const ROWS = map.length;
const COLS = map[0].length;

canvas.width = COLS * TILE;
canvas.height = ROWS * TILE;

// ===============================
// PAC-MAN
// ===============================

let pacman;

const initialPacman = {
    x: 1,
    y: 1
};

// ===============================
// FANTASMAS
// ===============================

let ghosts;

// ===============================
// VARIABLES DEL JUEGO
// ===============================

let score = 0;
let lives = 3;

let dots = [];

let gameStarted = false;
let gameOver = false;

let direction = {
    x: 0,
    y: 0
};

let nextDirection = {
    x: 0,
    y: 0
};

// ===============================
// INICIALIZAR JUEGO
// ===============================

function initGame() {

    score = 0;
    lives = 3;

    gameOver = false;
    gameStarted = false;

    direction = { x: 0, y: 0 };
    nextDirection = { x: 0, y: 0 };

    pacman = {
        x: initialPacman.x,
        y: initialPacman.y
    };

    ghosts = [
        {
            x: 8,
            y: 8,
            color: "#d60000",
            direction: { x: 1, y: 0 }
        },
        {
            x: 7,
            y: 8,
            color: "#ff3333",
            direction: { x: -1, y: 0 }
        }
    ];

    createDots();

    updateInterface();
    messageElement.textContent =
        "Presioná una flecha para comenzar";

    draw();
}

// ===============================
// CREAR PUNTOS
// ===============================

function createDots() {

    dots = [];

    for (let y = 0; y < ROWS; y++) {

        for (let x = 0; x < COLS; x++) {

            if (
                map[y][x] === "." &&
                !(x === pacman.x && y === pacman.y)
            ) {
                dots.push({
                    x: x,
                    y: y
                });
            }
        }
    }
}

// ===============================
// DIBUJAR TODO
// ===============================

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawBackground();
    drawWalls();
    drawDots();
    drawPacman();
    drawGhosts();
}

// ===============================
// FONDO
// ===============================

function drawBackground() {

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}

// ===============================
// PAREDES
// ===============================

function drawWalls() {

    for (let y = 0; y < ROWS; y++) {

        for (let x = 0; x < COLS; x++) {

            if (map[y][x] === "#") {

                ctx.fillStyle = "#d60000";

                ctx.fillRect(
                    x * TILE,
                    y * TILE,
                    TILE,
                    TILE
                );

                ctx.strokeStyle = "#111";

                ctx.lineWidth = 2;

                ctx.strokeRect(
                    x * TILE + 2,
                    y * TILE + 2,
                    TILE - 4,
                    TILE - 4
                );
            }
        }
    }
}

// ===============================
// DIBUJAR PUNTOS
// ===============================

function drawDots() {

    dots.forEach(dot => {

        const centerX =
            dot.x * TILE + TILE / 2;

        const centerY =
            dot.y * TILE + TILE / 2;

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            4,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#111";

        ctx.fill();
    });
}

// ===============================
// DIBUJAR PAC-MAN
// ===============================

function drawPacman() {

    const centerX =
        pacman.x * TILE + TILE / 2;

    const centerY =
        pacman.y * TILE + TILE / 2;

    const radius = 15;

    let angle = 0;

    if (direction.x === 1) {
        angle = 0;
    } else if (direction.x === -1) {
        angle = Math.PI;
    } else if (direction.y === -1) {
        angle = -Math.PI / 2;
    } else if (direction.y === 1) {
        angle = Math.PI / 2;
    }

    const mouth = Math.PI / 4;

    ctx.beginPath();

    ctx.moveTo(centerX, centerY);

    ctx.arc(
        centerX,
        centerY,
        radius,
        angle + mouth,
        angle - mouth + Math.PI * 2
    );

    ctx.closePath();

    ctx.fillStyle = "#111";

    ctx.fill();
}

// ===============================
// DIBUJAR FANTASMAS
// ===============================

function drawGhosts() {

    ghosts.forEach(ghost => {

        const centerX =
            ghost.x * TILE + TILE / 2;

        const centerY =
            ghost.y * TILE + TILE / 2;

        const radius = 15;

        ctx.fillStyle = ghost.color;

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY - 2,
            radius,
            Math.PI,
            0
        );

        ctx.lineTo(
            centerX + radius,
            centerY + radius
        );

        ctx.lineTo(
            centerX + 7,
            centerY + 9
        );

        ctx.lineTo(
            centerX,
            centerY + radius
        );

        ctx.lineTo(
            centerX - 7,
            centerY + 9
        );

        ctx.lineTo(
            centerX - radius,
            centerY + radius
        );

        ctx.closePath();

        ctx.fill();

        // Ojos

        ctx.fillStyle = "white";

        ctx.beginPath();

        ctx.arc(
            centerX - 6,
            centerY - 3,
            4,
            0,
            Math.PI * 2
        );

        ctx.arc(
            centerX + 6,
            centerY - 3,
            4,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle = "#111";

        ctx.beginPath();

        ctx.arc(
            centerX - 6,
            centerY - 3,
            2,
            0,
            Math.PI * 2
        );

        ctx.arc(
            centerX + 6,
            centerY - 3,
            2,
            0,
            Math.PI * 2
        );

        ctx.fill();
    });
}

// ===============================
// COMPROBAR PARED
// ===============================

function isWall(x, y) {

    if (
        x < 0 ||
        x >= COLS ||
        y < 0 ||
        y >= ROWS
    ) {
        return true;
    }

    return map[y][x] === "#";
}

// ===============================
// MOVIMIENTO DE PAC-MAN
// ===============================

function movePacman() {

    if (!gameStarted || gameOver) {
        return;
    }

    // Intentar cambiar de dirección

    const nextX =
        pacman.x + nextDirection.x;

    const nextY =
        pacman.y + nextDirection.y;

    if (!isWall(nextX, nextY)) {

        direction = {
            x: nextDirection.x,
            y: nextDirection.y
        };
    }

    const newX =
        pacman.x + direction.x;

    const newY =
        pacman.y + direction.y;

    if (!isWall(newX, newY)) {

        pacman.x = newX;
        pacman.y = newY;
    }

    eatDot();
}

// ===============================
// COMER PUNTO
// ===============================

function eatDot() {

    const index = dots.findIndex(
        dot =>
            dot.x === pacman.x &&
            dot.y === pacman.y
    );

    if (index !== -1) {

        dots.splice(index, 1);

        score += 10;

        updateInterface();
    }

    if (dots.length === 0) {

        gameWon();
    }
}

// ===============================
// MOVIMIENTO DE FANTASMAS
// ===============================

function moveGhosts() {

    if (!gameStarted || gameOver) {
        return;
    }

    ghosts.forEach(ghost => {

        const possibleDirections = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 }
        ];

        let validDirections =
            possibleDirections.filter(dir => {

                const newX =
                    ghost.x + dir.x;

                const newY =
                    ghost.y + dir.y;

                return !isWall(newX, newY);
            });

        // Evitar retroceder si hay otras opciones

        if (validDirections.length > 1) {

            validDirections =
                validDirections.filter(dir =>

                    !(
                        dir.x === -ghost.direction.x &&
                        dir.y === -ghost.direction.y
                    )
                );
        }

        if (validDirections.length > 0) {

            // A veces perseguir a Pac-Man

            if (Math.random() < 0.65) {

                validDirections.sort((a, b) => {

                    const distanceA =
                        Math.abs(
                            pacman.x -
                            (ghost.x + a.x)
                        ) +
                        Math.abs(
                            pacman.y -
                            (ghost.y + a.y)
                        );

                    const distanceB =
                        Math.abs(
                            pacman.x -
                            (ghost.x + b.x)
                        ) +
                        Math.abs(
                            pacman.y -
                            (ghost.y + b.y)
                        );

                    return distanceA - distanceB;
                });
            }

            const chosen =
                validDirections[
                    Math.floor(
                        Math.random() *
                        Math.min(
                            validDirections.length,
                            2
                        )
                    )
                ];

            ghost.direction = chosen;
        }

        const newX =
            ghost.x + ghost.direction.x;

        const newY =
            ghost.y + ghost.direction.y;

        if (!isWall(newX, newY)) {

            ghost.x = newX;
            ghost.y = newY;
        }
    });
}

// ===============================
// COLISIONES
// ===============================

function checkCollisions() {

    ghosts.forEach(ghost => {

        if (
            ghost.x === pacman.x &&
            ghost.y === pacman.y
        ) {

            loseLife();
        }
    });
}

// ===============================
// PERDER VIDA
// ===============================

function loseLife() {

    lives--;

    updateInterface();

    if (lives <= 0) {

        gameOver = true;

        messageElement.textContent =
            "GAME OVER";

        return;
    }

    messageElement.textContent =
        "¡Cuidado! Perdiste una vida";

    pacman.x = initialPacman.x;
    pacman.y = initialPacman.y;

    direction = {
        x: 0,
        y: 0
    };

    nextDirection = {
        x: 0,
        y: 0
    };

    ghosts[0].x = 8;
    ghosts[0].y = 8;

    ghosts[1].x = 7;
    ghosts[1].y = 8;
}

// ===============================
// GANAR
// ===============================

function gameWon() {

    gameOver = true;

    messageElement.textContent =
        "🎉 ¡GANASTE! 🎉";
}

// ===============================
// ACTUALIZAR INFORMACIÓN
// ===============================

function updateInterface() {

    scoreElement.textContent = score;
    livesElement.textContent = lives;
}

// ===============================
// TECLADO
// ===============================

document.addEventListener(
    "keydown",
    event => {

        let newDirection = null;

        switch (event.key) {

            case "ArrowUp":

                newDirection = {
                    x: 0,
                    y: -1
                };

                break;

            case "ArrowDown":

                newDirection = {
                    x: 0,
                    y: 1
                };

                break;

            case "ArrowLeft":

                newDirection = {
                    x: -1,
                    y: 0
                };

                break;

            case "ArrowRight":

                newDirection = {
                    x: 1,
                    y: 0
                };

                break;
        }

        if (newDirection) {

            event.preventDefault();

            nextDirection = newDirection;

            if (!gameStarted && !gameOver) {

                gameStarted = true;

                messageElement.textContent = "";
            }
        }
    }
);

// ===============================
// BOTÓN REINICIAR
// ===============================

restartButton.addEventListener(
    "click",
    () => {

        initGame();
    }
);

// ===============================
// BUCLE PRINCIPAL
// ===============================

setInterval(() => {

    if (!gameStarted || gameOver) {
        draw();
        return;
    }

    movePacman();
    moveGhosts();
    checkCollisions();

    draw();

}, 180);

// ===============================
// COMENZAR
// ===============================

initGame();
