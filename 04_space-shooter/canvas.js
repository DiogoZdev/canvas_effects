// MAIN
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth - 1;
canvas.height = innerHeight - 1;

// UTILS
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function getDistance(one, two) {
  if (!one || !two) {
    return 1
  }
  const xDist = one.x - two.x
  const yDist = one.y - two.y

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

const movement = {
  up: false,
  down: false,
  left: false,
  right: false
}

const data = {
  score: 0,
  isPaused: false,
}

addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight

  init()
})

addEventListener('keydown', (pressed) => {
  switch (pressed.key) {
    case 'ArrowUp':
    case 'w':
      movement.up = true;
      break;
    case 'ArrowDown':
    case 's':
      movement.down = true;
      break;
    case 'ArrowLeft':
    case 'a':
      movement.left = true;
      break;
    case 'ArrowRight':
    case 'd':
      movement.right = true;
      break;
    case ' ':
      if (spaceship) spaceship.shoot()
        break;
    case 'Enter':
      if (!spaceship) spaceship = new Speceship();
      else {
        spaceship.color = spaceship.mainColors[Math.floor(Math.random() * spaceship.mainColors.length)]
        spaceship.secondaryColor = spaceship.secondaryColors[Math.floor(Math.random() * spaceship.secondaryColors.length)]
      }
      break;
    case 'p':
      data.isPaused = !data.isPaused;
      break;
  }
})

addEventListener('keyup', (pressed) => {
  switch (pressed.key) {
    case 'ArrowUp':
    case 'w': 
      movement.up = false;
      break;
    case 'ArrowDown':
    case 's':
      movement.down = false;
      break;
    case 'ArrowLeft':
    case 'a':
      movement.left = false;
      break;
    case 'ArrowRight':
    case 'd':
      movement.right = false;
      break;
  }
})

// Objects
function Speceship() {
  this.life = 5
  this.x = canvas.width / 3
  this.y = canvas.height / 2
  this.mainColors = ['#ccd5ae', '#1b263b', '#6c757d', '#6c757d', '#495057', '#590d22' ]
  this.secondaryColors = ['#ffba08', '#f48c06', '#dc2f02', '#4ce0d2', '#70e000']
  
  this.color = this.mainColors[Math.floor(Math.random() * this.mainColors.length)]
  this.secondaryColor = this.secondaryColors[Math.floor(Math.random() * this.secondaryColors.length)]
  this.speed = 4

  this.shoot = () => {
    const shot = new Shot(this.secondaryColor)
    shot.x = this.x
    shot.y = this.y
    gunshots.push(shot)
  }

  this.draw = () => {
    if (!this.life) return;
    const [x, y] = [this.x, this.y]

    // wing (Outer)
    c.beginPath()
    c.moveTo(x - 10, y)
    c.lineTo(x - 10, y - 15)
    c.lineTo(x - 10 - 5 , y - 20)
    c.lineTo(x - 10 - 20, y - 20)
    c.lineTo(x - 10 - 20, y + 20)
    c.lineTo(x - 10 - 5, y + 20)
    c.lineTo(x - 10, y + 15)
    c.lineTo(x - 10, y)
    c.fillStyle = this.color
    c.fill()
    c.closePath()

    // wing - inner
    c.beginPath()
    c.moveTo(x - 10, y)
    c.lineTo(x - 10, y - 10)
    c.lineTo(x - 10 - 5 , y - 15)
    c.lineTo(x - 10 - 15, y - 15)
    c.lineTo(x - 10 - 15, y + 15)
    c.lineTo(x - 10 - 5, y + 15)
    c.lineTo(x - 10, y + 10) 
    c.lineTo(x - 10, y)
    c.fillStyle = this.secondaryColor
    c.fill()
    c.closePath()

    // tail wing
    c.beginPath()
    c.moveTo(x - 40, y)
    c.lineTo(x - 40, y - 10)  
    c.lineTo(x - 40 - 5, y - 15)
    c.lineTo(x - 40 - 15, y - 15)
    c.lineTo(x - 40 - 15, y + 15)
    c.lineTo(x - 40 - 5, y + 15)
    c.lineTo(x - 40, y + 10)
    c.fillStyle = this.secondaryColor
    c.fill()
    c.closePath()

    // body
    c.beginPath()
    c.moveTo(x, y - 5)
    c.lineTo(x - 60, y - 5)
    c.lineTo(x - 60, y + 5)
    c.lineTo(x, y + 5)
    c.fillStyle = this.color
    c.fill()
    c.closePath() 

    // front stripe
    c.beginPath()
    c.moveTo(x - 3, y - 5)
    c.lineTo(x - 3, y + 5)
    c.lineTo(x - 1, y + 5)
    c.lineTo(x - 1, y - 5)
    c.fillStyle = this.secondaryColor
    c.fill()
    c.closePath()

    // gun
    c.beginPath();
    c.moveTo(x, y - 2); // Start at the front of the spaceship
    c.lineTo(x + 10, y - 2); // Extend forward
    c.lineTo(x + 10, y + 2); // Extend down
    c.lineTo(x, y + 2); // Close back
    c.fillStyle = "#333333"; // Gun color (dark gray)
    c.fill();
    c.closePath();

    // gun barrel
    c.beginPath();
    c.moveTo(x + 10, y - 1); // Start at the gun tip
    c.lineTo(x + 15, y - 1); // Extend barrel forward
    c.lineTo(x + 15, y + 1); // Extend barrel down
    c.lineTo(x + 10, y + 1); // Close back
    c.fillStyle = "#555555"; // Barrel color (lighter gray)
    c.fill();
    c.closePath();
  }

  this.update = () => {
    if (!this.life) spaceship = null;
    if (movement.up && this.y > 10) {
      this.y -= this.speed
    }
    if (movement.down && this.y < canvas.height - 10) {
      this.y += this.speed
    }
    if (movement.left && this.x > 10) {
      this.x -= this.speed
    }
    if (movement.right && this.x < canvas.width - 10) {
      this.x += this.speed
    }

    this.draw()
  }
}

function Shot(color) {
  this.x = spaceship.x
  this.y = spaceship.y
  this.rad = 2
  this.speed = 9
  this.color = color || 'orange'

  this.draw = () => {
    c.beginPath()
    c.arc(this.x, this.y, this.rad, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
  }

  this.update = () => {
    this.x += this.speed;

    this.draw();
  }

}

function Enemy() {
  this.x = canvas.width + 100;
  this.y = Math.random() * canvas.height;
  this.super = Math.random() > 0.9
  this.rad = 15
  this.life = this.super ? randomIntFromRange(1500, 2000) : randomIntFromRange(300, 600)
  this.maxLife = this.life
  const colors = ['#fff', '#adf', '#fff', '#f04', '#05f', '#cc0']
  this.color = this.super ? '#222' : colors[Math.floor(Math.random() * colors.length)]
  this.secondaryColor = this.super ? 'red' : colors[Math.floor(Math.random() * colors.length)]

  this.draw = () => {
    const [x, y] = [this.x, this.y]

    const lifeBarSize = Math.floor((this.life / this.maxLife)  * 10)

    // life bar
    if (this.maxLife !== this.life) {
      c.beginPath()
      c.moveTo(x - 10, y - 30)
      c.lineTo(x + 10, y - 30)
      c.lineTo(x + 10, y - 25)
      c.lineTo(x - 10, y - 25)
      c.fillStyle = '#222'
      c.fill()
      c.closePath()

      c.beginPath()
      c.moveTo(x - 10, y - 30)
      c.lineTo(x + lifeBarSize, y - 30)
      c.lineTo(x + lifeBarSize, y - 25)
      c.lineTo(x - 10, y - 25)
      c.fillStyle = '#0c0'
      c.fill()
      c.closePath()
    }

    // wing (Outer)
    c.beginPath();
    c.moveTo(x + 10, y);
    c.lineTo(x + 10, y - 15);
    c.lineTo(x + 10 + 5, y - 20);
    c.lineTo(x + 10 + 20, y - 20);
    c.lineTo(x + 10 + 20, y + 20);
    c.lineTo(x + 10 + 5, y + 20);
    c.lineTo(x + 10, y + 15);
    c.lineTo(x + 10, y);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();

    // wing - inner
    c.beginPath();
    c.moveTo(x + 10, y);
    c.lineTo(x + 10, y - 10);
    c.lineTo(x + 10 + 5, y - 15);
    c.lineTo(x + 10 + 15, y - 15);
    c.lineTo(x + 10 + 15, y + 15);
    c.lineTo(x + 10 + 5, y + 15);
    c.lineTo(x + 10, y + 10);
    c.lineTo(x + 10, y);
    c.fillStyle = this.secondaryColor;
    c.fill();
    c.closePath();

    // tail wing
    c.beginPath();
    c.moveTo(x + 40, y);
    c.lineTo(x + 40, y - 10);
    c.lineTo(x + 40 + 5, y - 15);
    c.lineTo(x + 40 + 15, y - 15);
    c.lineTo(x + 40 + 15, y + 15);
    c.lineTo(x + 40 + 5, y + 15);
    c.lineTo(x + 40, y + 10);
    c.fillStyle = this.secondaryColor;
    c.fill();
    c.closePath();

    // body
    c.beginPath();
    c.moveTo(x, y - 5);
    c.lineTo(x + 60, y - 5);
    c.lineTo(x + 60, y + 5);
    c.lineTo(x, y + 5);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();

    // front stripe
    c.beginPath();
    c.moveTo(x + 3, y - 5);
    c.lineTo(x + 3, y + 5);
    c.lineTo(x + 1, y + 5);
    c.lineTo(x + 1, y - 5);
    c.fillStyle = this.secondaryColor;
    c.fill();
    c.closePath();

    // gun
    c.beginPath();
    c.moveTo(x, y - 2); // Start at the back of the spaceship
    c.lineTo(x - 10, y - 2); // Extend backward
    c.lineTo(x - 10, y + 2); // Extend down
    c.lineTo(x, y + 2); // Close back
    c.fillStyle = "#333333"; // Gun color (dark gray)
    c.fill();
    c.closePath();

    // gun barrel
    c.beginPath();
    c.moveTo(x - 10, y - 1); // Start at the gun tip
    c.lineTo(x - 15, y - 1); // Extend barrel backward
    c.lineTo(x - 15, y + 1); // Extend barrel down
    c.lineTo(x - 10, y + 1); // Close back
    c.fillStyle = "#555555"; // Barrel color (lighter gray)
    c.fill();
    c.closePath();
  }

  this.update = () => {
    if (this.x < canvas.width / 2) {
      this.x -= 0.5;
    } else {
      this.x -= 1
    }

    this.draw();
  }
}

function Star(config) {
  this.x = config?.start ? Math.random() * canvas.width : canvas.width;
  this.y = Math.random() * canvas.height;
  this.colors = ['#fff', '#adf', '#fff', '#f04', '#05f', '#cc0' ]
  this.color = this.colors[Math.floor(Math.random() * this.colors.length)]
  this.isSpecial = Math.random() < .01


  this.draw = () => {
    if (this.isSpecial) {
      c.beginPath()
      c.moveTo(this.x, this.y - 8); // Top point (outer)
      c.lineTo(this.x + 1, this.y - 1); // Right upper point (inner)
      c.lineTo(this.x + 8, this.y); // Right point (outer)
      c.lineTo(this.x + 1, this.y + 1); // Right lower point (inner)
      c.lineTo(this.x, this.y + 8); // Bottom point (outer)
      c.lineTo(this.x - 1, this.y + 1); // Left lower point (inner)
      c.lineTo(this.x - 8, this.y); // Left point (outer)
      c.lineTo(this.x - 1, this.y - 1); // Left upper point (inner)
      c.fillStyle = this.color;
      c.fill()
      c.closePath()
    } else {
      c.beginPath()
      c.arc(this.x, this.y, 1, 0, Math.PI * 2, false)
      c.fillStyle = this.color;
      c.fill()
      c.closePath()
    }
  }

  this.update = () => {
    this.x -= this.isSpecial ? 6 : 8;
    this.draw();
  } 
}

// Implementation
const particles = []
const gunshots = []
const stars = []
const enemies = [];
let spaceship

function init() {
  spaceship = new Speceship()
  spaceship.draw()

  for (let i = 0; i < 100; i++) {
    stars.push(new Star({ start: true }))
  }
  
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate)
  
  c.font = 'bold 20px Courier'

  if (data.isPaused) {

    c.font = '20px Courier'

    c.beginPath();
    c.fillStyle = 'white';
    c.fillText('PAUSED', canvas.width / 2, canvas.height / 2)
    c.fillText('PRESS `P` TO START', canvas.width / 2 - 80, canvas.height / 2 + 20, undefined)
    c.closePath();
    
    return;
  }
  
  c.clearRect(0, 0, canvas.width, canvas.height)
  
  c.beginPath();
  c.fillStyle = 'white';
  c.fillText(`SCORE: ${data.score}`, canvas.width - 200, 50, 400)
  c.closePath();
  
  stars.push(new Star())
  
  // Update Stars
  for (let i = 0; i < stars.length; i++) {
    stars[i].update()

    if (stars[i].x < 0) {
      stars.splice(i, 1)
    }
  }


  // Chance of spawning new Enemy
  const enemySpawnChance = Math.floor(Math.random() * 1000)
  if (enemySpawnChance < 3) {
    enemies.push(new Enemy())
  }

  // Update Enemies
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].update()

    const spaceShipDistance = getDistance(enemies[i], spaceship)

    if (spaceship && spaceShipDistance - enemies[i].rad <= 0) {
      if (spaceship) spaceship.x -= 60;
      if (spaceship) spaceship.life -= 1;
    }

    for (let j = 0; j < gunshots.length; j++) {
      const distance = getDistance(enemies[i], gunshots[j])

      if (distance < enemies[i]?.rad + gunshots[j]?.rad) {
        enemies[i].life -= 20
        gunshots.splice(j, 1)

        if (enemies[i].life <= 0) {
          data.score += Math.floor(enemies[i].maxLife / 10)
          enemies.splice(i, 1)
        }
      }
    }

    if (enemies[i]?.x < 0) {
      enemies.splice(i, 1)
    }
  }

  spaceship?.update()

  // Update gunshots
  for (let i = 0; i < gunshots.length; i++) {
    gunshots[i].update()

    if (gunshots[i].x > canvas.width) {
      gunshots.splice(i, 1)
    }
  }
}

init()
animate()