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


let x = canvas.width / 2;
const y = canvas.height * 0.9;

const player = new Player(x, y, 30, 'blue');
const projectiles = [];
const enemies = [];


function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    projectiles.forEach((projectile) => {
        projectile.update();
    })
    enemies.forEach((enemy, index) => {
        enemy.update()
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

addEventListener('click', shoot, false);

function shoot(e) {

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


animate();

