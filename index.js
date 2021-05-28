const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

c.canvas.width = innerWidth; //by default is window.innerWidth
c.canvas.height = innerHeight;


const space = new Image();
const planet = new Image();
const earth = new Image();

const scoreEl = document.querySelector('#scoreEl');
const startGameBtn = document.querySelector('#startGameBtn');
const startDiv = document.querySelector('#startDiv');
const bigScoreEl = document.querySelector('#bigScoreEl');


class Player {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
    }

    draw() {

        c.filter = 'drop-shadow(0px 0px 10px white) sepia(0.3)';
        earth.src = 'earth.png';
        c.drawImage(earth, this.x, this.y, this.size, this.size);
    }

    update() {
        this.draw();
    }
}

class Projectile {
    constructor(x, y, size, velocity) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.velocity = velocity;
    }

    draw() {

        c.filter = 'contrast(1.5) sepia(0.5) blur(3px)';
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        c.fillStyle = 'rgba(250,249,249,1)';
        c.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

const images = [
    "planets/earth.png",
    "planets/jupiter.png",
    "planets/mars.png",
    "planets/neptun.png",
    "planets/saturn.png",
    "planets/uran.png",
    "planets/venus.png"
];

function generatePlanet() {

}

class Enemy {
    constructor(x, y, radius, velocity, i) {
        this.i = i;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocity = velocity;
    }

    draw() {
        c.filter = 'drop-shadow(0px 0px 3px white)';
        console.log(images[this.i]);
        planet.src = images[this.i];
        c.drawImage(planet, this.x, this.y, this.radius, this.radius);


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


function spawnEnemies() {
    setInterval(() => {

        const i = Math.round(Math.random() * 7);
        const radius = Math.random() * (150 - 50) + 50;
        const x = Math.floor(Math.random() * ((canvas.width - radius) - radius)) + radius;
        const y = -100;
        const velocity = {
            x: 0,
            y: 1
        }

        enemies.push(new Enemy(x, y, radius, velocity, i));
    }, 3000);
}


let animationId;
let score = 0;


function animate() {

    animationId = requestAnimationFrame(animate);
    c.filter = 'blur(1px)';
    space.src = 'space.jpg';
    c.drawImage(space, 0, 0, canvas.width, canvas.height);
    // c.fillStyle = 'rgba(0,0,0,0.1)';
    // c.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();
    projectiles.forEach((projectile, index) => {
        projectile.update();
        //remove projectiles from edges of screen
        if (projectile.x + projectile.size < 0 || projectile.x - projectile.size > canvas.width ||
            projectile.y + projectile.size < 0 || projectile.y - projectile.size > canvas.width) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0);
        }
    })


    enemies.forEach((enemy, index) => {
        enemy.update()


        //end of the game
        const dist = canvas.height - enemy.y;
        if (dist - enemy.radius < -20) {
            console.log(dist);
            cancelAnimationFrame(animationId);
            bigScoreEl.innerHTML = score;
            startDiv.style.display = 'flex';
        }


        //when projectile touch enemy
        projectiles.forEach((projectile, projectileIndex) => {

            projectiles.forEach((projectile, projectileIndex) => {
                const dist = Math.hypot(projectile.x - enemy.x - enemy.radius, projectile.y - enemy.y)

                if (dist - enemy.radius - projectile.size + 20 < 1) {

                    score += 1;
                    scoreEl.innerHTML = score;

                    setTimeout(() => {

                        // gsap.to(enemy,
                        // {
                        //     size : enemy.size - 20
                        // });
                        enemies.splice(index, 1);
                        projectiles.splice(projectileIndex, 1);
                    }, 0)
                }
            })
        })
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
            new Projectile(player.x + 60, player.y, 5, velocity)
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
    spawnEnemies();
    startDiv.style.display = 'none';
}

window.onload = load;

function load() {
    c.filter = 'blur(1px)';
    space.src = 'space.jpg';
    c.drawImage(space, 0, 0, canvas.width, canvas.height);
}





