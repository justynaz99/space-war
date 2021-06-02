const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

c.canvas.width = innerWidth; //by default is window.innerWidth
c.canvas.height = innerHeight;

const scoreEl = document.querySelector('#scoreEl');
const startGameBtn = document.querySelector('#startGameBtn');
const startDiv = document.querySelector('#startDiv');
const bigScoreEl = document.querySelector('#bigScoreEl');

const space = new Image();
const planet = new Image();
const earth = new Image();
const person = new Image();

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
    constructor(x, y, height, velocity, i) {
        this.i = i;
        this.x = x;
        this.y = y;
        this.height = height;
        this.velocity = velocity;
    }

    draw() {
        c.filter = 'drop-shadow(0px 0px 10px #828181) blur(0.9px)';
        planet.src = images[this.i];
        c.drawImage(planet, this.x, this.y, this.height - 6, this.height);
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

let x = canvas.width / 2;
const y = canvas.height * 0.8;

let player = new Player(x, y, 150);
let projectiles = [];
let enemies = [];

function init() {
    player = new Player(x, y, 150);
    projectiles = [];
    enemies = [];
    score = 0;
}


function generateEnemy() {
    setInterval(() => {
        const i = Math.round(Math.random() * 7);
        const height = Math.random() * (150 - 50) + 50;
        const x = Math.floor(Math.random() * ((canvas.width - height) - height)) + height;
        const y = -100;
        const velocity = {
            x: 0,
            y: 1
        }
        enemies.push(new Enemy(x, y, height, velocity, i));
    }, 3000);
}


let animationId;
let score = 0;

function animate() {
    animationId = requestAnimationFrame(animate);

    c.filter = 'blur(1px)';
    space.src = 'space.jpg';
    c.drawImage(space, 0, 0, canvas.width, canvas.height);

    player.draw();


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

    //when projectile touch enemy
    enemies.forEach((enemy, index) => {
        enemy.update()
        projectiles.forEach((projectile, projectileIndex) => {

            projectiles.forEach((projectile, projectileIndex) => {

                let collisionX = enemy.x + enemy.height - 30 >= projectile.x && projectile.x + projectile.height - 30 >= enemy.x;
                let collisionY = enemy.y + enemy.height - 20 >= projectile.y && projectile.y + projectile.height + 20 >= enemy.y;


                if (collisionY && collisionX) {
                    score += 1;
                    scoreEl.innerHTML = score;

                    setTimeout(() => {
                        enemies.splice(index, 1);
                        projectiles.splice(projectileIndex, 1);
                    }, 0)
                }


            })
        })

        //end of the game
        const dist = canvas.height - enemy.y;
        if (dist - enemy.height < -20) {
            cancelAnimationFrame(animationId);
            bigScoreEl.innerHTML = score;
            startDiv.style.display = 'flex';
        }

    })
}


addEventListener('keydown', move, false);

function move(e) {
    switch (e.keyCode) {
        case (37):
            if (player.x > 0) {
                player.x = player.x - 10;
                player.update();
            }
            break;
        case (39):
            if (player.x < c.canvas.width - 150) {
                player.x = player.x + 10;
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

startGameBtn.addEventListener('click', startGame, false);

function startGame() {
    c.filter = 'blur(1px)';
    space.src = 'space.jpg';
    c.drawImage(space, 0, 0, canvas.width, canvas.height);
    init();
    animate();
    generateEnemy();
    startDiv.style.display = 'none';
}

window.onload = load;

function load() {
    c.filter = 'blur(1px)';
    space.src = 'space.jpg';
    c.drawImage(space, 0, 0, canvas.width, canvas.height);
}

addEventListener('keydown', pauseGame, false);

function pauseGame(e) {
    if (e.keyCode === 16) {
        cancelAnimationFrame(animationId);
    }
}





