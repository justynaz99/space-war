const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

c.canvas.width = innerWidth; //by default is window.innerWidth
c.canvas.height = innerHeight;

const scoreEl = document.querySelector('#scoreEl');
const startGameBtn = document.querySelector('#startGameBtn');
const startDiv = document.querySelector('#startDiv');
const bigScoreEl = document.querySelector('#bigScoreEl');
const moneyDiv = document.querySelector('#moneyDiv');
const livesDiv = document.querySelector('#livesDiv');
const livesEl = document.querySelector('#livesEl');
const moneyEl = document.querySelector('#moneyEl');
const lvlEl = document.querySelector('#lvlEl');


const startLvl2Btn = document.querySelector('#startLvl2Btn')
const lvl2Div = document.querySelector('#lvl2Div')

const startLvl3Btn = document.querySelector('#startLvl3Btn');
const lvl3Div = document.querySelector('#lvl3Div');

const playAgainBtn = document.querySelector('#playAgainBtn');
const gameOverDiv = document.querySelector('#gameOverDiv');


const space = new Image();
const planet = new Image();
const earth = new Image();
const person = new Image();
const alien = new Image();
const coin = new Image();


const images = [
    "planets/earth.png",
    "planets/jupiter.png",
    "planets/mars.png",
    "planets/neptun.png",
    "planets/saturn.png",
    "planets/uran.png",
    "planets/venus.png"
];


class Player {
    constructor(x, y, height) {
        this.x = x;
        this.y = y;
        this.height = height;

    }

    draw() {
        c.filter = 'drop-shadow(0px 0px 20px #454343) sepia(0.3) blur(0.7px)';
        earth.src = 'earth.png';
        c.drawImage(earth, this.x, this.y, this.height + 7, this.height);
    }

    update() {
        this.draw();

    }
}

class Projectile {
    constructor(x, y, height, velocity) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.velocity = velocity;
    }

    draw() {
        c.filter = 'drop-shadow(0px 0px 10px #454343) blur(1px)';
        person.src = "person.png";
        c.drawImage(person, this.x, this.y, this.height, this.height);
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

class Enemy {
    constructor(x, y, height, velocity, image) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.height = height;
        this.velocity = velocity;
    }

    draw() {
        c.filter = 'drop-shadow(0px 0px 10px #828181) blur(0.9px)';
        planet.src = images[this.image];
        c.drawImage(planet, this.x, this.y, this.height - 6, this.height);
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

class Alien {
    constructor(x, y, height, velocity) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.velocity = velocity;
    }

    draw() {
        c.filter = 'drop-shadow(0px 0px 3px #acbfa4) blur(0.9px)';
        alien.src = 'alien.png'
        c.drawImage(alien, this.x, this.y, this.height, this.height - 10);
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

class Coin {
    constructor(x, y, height, velocity) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.velocity = velocity;
    }

    draw() {
        c.filter = 'drop-shadow(0px 0px 3px #d4bd7d) blur(0.9px)';
        coin.src = 'coin.png'
        c.drawImage(coin, this.x, this.y, this.height, this.height);
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

class Particle {
    constructor(x, y, radius, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = '#828181';
        this.velocity = velocity;
        this.alpha = 1;
    }

    draw() {
        c.save();
        c.filter = 'drop-shadow(0px 0px 30px #828181) blur(2px)';
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.restore();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -= 0.02;
    }
}


let x = canvas.width / 2;
const y = canvas.height * 0.85;


let player;
let projectiles;
let enemies;
let particles;
let aliens;
let coins;
let score;
let money;
let lives;

function init() {
    player = new Player(x, y, 150);
    projectiles = [];
    enemies = [];
    particles = [];
    aliens = [];
    coins = [];
}

const ENEMIES_TIMEOUT = 3000;

function generateEnemies() {
    setInterval(() => {
        const image = Math.round(Math.random() * 7);
        const height = Math.random() * (150 - 50) + 50;
        const x = Math.floor(Math.random() * ((canvas.width - height) - height)) + height;
        const y = -100;
        const velocity = {
            x: 0,
            y: 1
        }
        enemies.push(new Enemy(x, y, height, velocity, image));
    }, ENEMIES_TIMEOUT);
}

const MAX_ALIENS_TIMEOUT = 10000;
const MIN_ALIENS_TIMEOUT = 6000;

function generateAliens() {
    setInterval(() => {
        const height = 100;
        const x = Math.floor(Math.random() * ((canvas.width - height) - height)) + height;
        const y = -100;
        const velocity = {
            x: 0,
            y: 6
        }
        aliens.push(new Alien(x, y, height, velocity));
    }, Math.random() * (MAX_ALIENS_TIMEOUT - MIN_ALIENS_TIMEOUT) + MIN_ALIENS_TIMEOUT);
}

const MAX_COINS_TIMEOUT = 10000;
const MIN_COINS_TIMEOUT = 5000;

function generateCoins() {
    setInterval(() => {
        const height = 50;
        const x = Math.floor(Math.random() * ((canvas.width - height) - height)) + height;
        const y = -100;
        const velocity = {
            x: 0,
            y: 3
        }
        coins.push(new Coin(x, y, height, velocity));
    }, Math.random() * (MAX_COINS_TIMEOUT - MIN_COINS_TIMEOUT) + MIN_COINS_TIMEOUT);
}


let animationId;


function animate() {

    animationId = requestAnimationFrame(animate);

    c.filter = 'blur(1px)';
    space.src = 'space.jpg';
    c.drawImage(space, 0, 0, canvas.width, canvas.height);

    player.draw();

    addEventListener('keydown', move, false);

    checkScore();

    buyLife();

    updateParticles();

    updateProjectiles();

    updateEnemies();

    updateAliens();

    updateCoins();

}

function checkScore() {
    if (score === 10) {
        cancelAnimationFrame(animationId);
        particles = [];
        removeEventListener('keydown', move, false);
        lvl2Div.style.display = 'flex';
        score++;
        scoreEl.innerHTML = score;
    } else if (score === 20) {
        cancelAnimationFrame(animationId);
        particles = [];
        removeEventListener('keydown', move, false);
        lvl3Div.style.display = 'flex';
        score++;
        scoreEl.innerHTML = score;
    }
}

function buyLife() {
    if (money === 3) {
        lives++;
        money = 0;
        livesEl.innerHTML = lives;
        moneyEl.innerHTML = money;
    }
}


function updateEnemies() {
    //when projectile touch enemy

    enemies.forEach((enemy, index) => {
        enemy.update()
        projectiles.forEach((projectile, projectileIndex) => {

            let collisionX = enemy.x + enemy.height - 30 >= projectile.x && projectile.x + projectile.height - 30 >= enemy.x;
            let collisionY = enemy.y + enemy.height - 20 >= projectile.y && projectile.y + projectile.height + 20 >= enemy.y;
            let particlesQuantity = 10;

            if (collisionY && collisionX) {
                score += 1;
                scoreEl.innerHTML = score;

                if (enemy.height > 100) {
                    gsap.to(enemy,
                        {
                            height: enemy.height - 50,
                            x: enemy.x + enemy.height / 4
                        });
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1);
                    }, 0)
                } else {
                    setTimeout(() => {
                        enemies.splice(index, 1);
                        projectiles.splice(projectileIndex, 1);
                    }, 0)
                    for (let i = 0; i < particlesQuantity; i++) {
                        particles.push(new Particle(projectile.x, projectile.y, 3, {
                            x: (Math.random() - 0.5) * 3,
                            y: (Math.random() - 0.5) * 3
                        }))
                    }
                }
            }

        })


        //end of the game
        let dist = canvas.height - enemy.y;
        if (dist - enemy.height < -20 && lives === 0 || (dist - enemy.height < -20 && lvl1)) {
            cancelAnimationFrame(animationId);
            removeEventListener('keydown', move, false);
            bigScoreEl.innerHTML = score;
            gameOverDiv.style.display = 'flex';
        }

        if ((dist - enemy.height < -20 && lives > 0)) {
            lives--;
            livesEl.innerHTML = lives;
            enemies = [];
            coins = [];
            aliens = [];

        }


    })


}

function updateProjectiles() {
    //when projectile is out of window
    projectiles.forEach((projectile, index) => {
        projectile.update();
        if (projectile.x + projectile.height < 0 || projectile.x - projectile.height > canvas.width ||
            projectile.y + projectile.height < 0 || projectile.y - projectile.height > canvas.width) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0);
        }
    })
}

function updateParticles() {
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1)
        } else {
            particle.update();
        }
    })
}

function updateAliens() {
    aliens.forEach((alien, index) => {
        alien.update();

        let collisionX = alien.x + alien.height - 30 >= player.x && player.x + player.height - 30 >= alien.x;
        let collisionY = alien.y + alien.height - 20 >= player.y && player.y + player.height - 20 >= alien.y;

        if (collisionX && collisionY && lives === 0) {
            cancelAnimationFrame(animationId);
            removeEventListener('keydown', move, false);
            bigScoreEl.innerHTML = score;
            gameOverDiv.style.display = 'flex';
        }

        if ((collisionX && collisionY && lives > 0)) {
            lives--;
            livesEl.innerHTML = lives;
            enemies = [];
            aliens = [];
            coins = [];
        }
    })
}

function updateCoins() {
    coins.forEach((coin, index) => {
        coin.update();

        let collisionX = coin.x + coin.height - 30 >= player.x && player.x + player.height - 30 >= coin.x;
        let collisionY = coin.y + coin.height - 20 >= player.y && player.y + player.height - 20 >= coin.y;

        if (collisionX && collisionY) {
            money++;
            moneyEl.innerHTML = money;
            coins.splice(index, 1);
        }
    })
}


const offset = 15;

function move(e) {
    switch (e.keyCode) {
        case (37):
            if (player.x > 0) {
                player.x = player.x - offset;
                player.update();
            }
            break;
        case (39):
            if (player.x < c.canvas.width - player.height) {
                player.x = player.x + offset;
                player.update();
            }
            break;
    }
}


addEventListener('keyup', shoot, false);

function shoot(e) {
    if (e.keyCode === 32) {
        const angle = Math.atan2(-90, 0);

        const velocity = {
            x: Math.cos(angle) * 6,
            y: Math.sin(angle) * 6
        }
        projectiles.push(
            new Projectile(player.x + 60, player.y, 50, velocity)
        );
    }
}

function hideDivs() {
    for (let i = 0; i < arguments.length; i++) {
        arguments[i].style.display = 'none';
    }
}

function showDivs() {
    for (let i = 0; i < arguments.length; i++) {
        arguments[i].style.display = 'inline';
    }
}


startGameBtn.addEventListener('click', startGame, false);

startLvl2Btn.addEventListener('click', startLvl2, false);

startLvl3Btn.addEventListener('click', startLvl3, false);

playAgainBtn.addEventListener('click', playAgain, false);

let lvl1 = false;

function startGame() {
    score = 0;
    scoreEl.innerHTML = score;
    c.filter = 'blur(1px)';
    space.src = 'space.jpg';
    c.drawImage(space, 0, 0, canvas.width, canvas.height);
    init();
    animate();
    generateEnemies();
    lvl1 = true;
    hideDivs(startDiv, lvl2Div, lvl3Div, moneyDiv, gameOverDiv, livesDiv);
}

function startLvl2() {
    init();
    animate();
    generateAliens();
    money = 0;
    lives = 0;
    lvl1 = false;
    lvlEl.innerHTML = '2';
    hideDivs(startDiv, lvl2Div, lvl3Div, gameOverDiv, moneyDiv, livesDiv);
}

function startLvl3() {
    init();
    animate();
    generateCoins();
    lvlEl.innerHTML = '3';
    hideDivs(startDiv, lvl2Div, lvl3Div, gameOverDiv);
    showDivs(livesDiv, moneyDiv);
}

function playAgain() {
    window.location.reload();
}


window.onload = load;

function load() {
    c.filter = 'blur(1px)';
    space.src = 'space.jpg';
    c.drawImage(space, 0, 0, canvas.width, canvas.height);
    hideDivs(lvl2Div, lvl3Div, moneyDiv, gameOverDiv, livesDiv, gameOverDiv, moneyDiv);

}

addEventListener('keydown', pauseGame, false);

function pauseGame(e) {
    if (e.keyCode === 16) {
        cancelAnimationFrame(animationId);
    }
}





