const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

c.canvas.width = innerWidth; //by default is window.innerWidth
c.canvas.height = innerHeight;

class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        this.draw();
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}


let x = canvas.width / 2;
const y = canvas.height * 0.9;

const player = new Player(x, y, 30, 'blue');
const projectiles = [];
const enemies = [];

// function spawnEnemies() {
//     setInterval(() => {
//         const radius = Math.random() * (30 - 15) + 15;
//
//         let x;
//         let y;
//
//         if (Math.random() < 0.5) {
//             x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
//             y = Math.random() * canvas.height;
//         } else {
//             x = Math.random() * canvas.width;
//             y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
//         }
//
//         const color = 'green';
//         const angle = Math.atan2(
//             canvas.height / 2 - y,
//             canvas.width / 2 - x);
//         const velocity = {
//             x: Math.cos(angle),
//             y: Math.sin(angle)
//         }
//
//         enemies.push(new Enemy(x, y, radius, color, velocity));
//         console.log(enemies);
//     }, 1000);
// }

function spawnEnemies() {
    setInterval(() => {

        const x = Math.floor(Math.random() * ((canvas.width - 30) - 30) ) + 30;
        const y = 0;
        const radius = Math.random() * (30 - 15) + 15;
        const color = 'green';
        const velocity = {
            x: 0,
            y: 1
        }

        enemies.push(new Enemy(x, y, radius, color, velocity));
        console.log(enemies);
    }, 3000);
}




function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    projectiles.forEach((projectile) => {
        projectile.update();
    })
    enemies.forEach((enemy, index) => {
        enemy.update()

        const dist = canvas.height - enemy.y;
        if (dist < 1) {
            console.log('end game');
        }

        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

            if (dist - enemy.radius - projectile.radius < 1) {
                setTimeout(() => {
                    enemies.splice(index, 1);
                    projectiles.splice(projectileIndex, 1);
                }, 0)
            }
        })
    })
}

addEventListener('keydown', move, false);

function move(e) {
    switch (e.keyCode) {
        case (37):
            if (player.x > 30) {
                player.x = player.x - 10;
                player.update();
            }
            break;
        case (39):
            if (player.x < c.canvas.width - 30) {
                player.x = player.x + 10;
                player.update();
            }
            break;
    }
}

addEventListener('keyup', shoot, false);

function shoot(e) {

    if (e.keyCode === 32) {
        const angle = Math.atan2(-90,
            0);

        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        projectiles.push(
            new Projectile(player.x, player.y, 5, 'red', velocity)
        );
    }

}


animate();
spawnEnemies();

