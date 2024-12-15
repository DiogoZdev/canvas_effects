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


// MAIN
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const gravity = 1;
let errorCount = 0;

let isPaused = false;

canvas.width = innerWidth - 1;
canvas.height = innerHeight - 1;

addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight

  init()
})

addEventListener('keydown', (pressed) => {
  console.log(pressed.key)
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
      isPaused = !isPaused;
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
function Particle(x, y, stroke, rad) {
  this.x = x;
  this.y = y;
  this.velocity = {
    x: (Math.random() - 0.5) * 5,
    y: (Math.random() - 0.5) * 5
  };
  this.color = `${stroke}aa`;
  this.stroke = stroke;
  this.radius = rad || 50;
  this.mass = rad;
  

  this.draw = () => {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.strokeStyle = this.stroke
    c.stroke()
    c.fillStyle = this.color
    c.fill()
    c.closePath()
  }

  this.update = particles => {
    this.x += this.velocity.x
    this.y += this.velocity.y

    const nextY = this.y + this.radius + this.velocity.y;
    if (nextY > innerHeight || nextY < 0) {
      this.velocity.y *= -1
    } 

    const nextX = this.x + this.radius + this.velocity.x;
    if (nextX > innerWidth || nextX < 0) {
      this.velocity.x *= -1
    }

    if (getDistance(this, mouse) < 150) {
      this.color = this.stroke
    } else {
      this.color = `${this.stroke}33`
    }

    this.draw();

    for (let i = 0; i < particles.length; i++) {
      if (this === particles[i]) continue;      

      const distance = getDistance(this, particles[i]) - (this.radius + particles[i].radius)
      
      if (distance <= 0) {
        resolveCollision(this, particles[i])  
      }
    }
  }
}

function Shot(color) {
  this.x = spaceship.x
  this.y = spaceship.y
  this.rad = 3
  this.speed = 7
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

function Speceship() {
  this.life = 5
  this.x = canvas.width / 2
  this.y = canvas.height / 2
  this.mainColors = ['#3a506b', '#5bc0be', '#967aa1', '#0d00a4', '#e8d7f1', '#c0a9b0' ]
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
    c.beginPath()
    c.moveTo(this.x, this.y)
    c.lineTo(this.x - 25, this.y - 8)
    c.lineTo(this.x - 25, this.y - 15)
    c.lineTo(this.x - 40, this.y - 20)
    c.lineTo(this.x - 30, this.y - 7)
    c.lineTo(this.x - 30, this.y + 8)
    c.lineTo(this.x - 40, this.y + 20)
    c.lineTo(this.x - 25, this.y + 15)
    c.lineTo(this.x - 25, this.y + 8)
    c.fillStyle = this.color
    c.fill()
    c.closePath()

    c.beginPath()
    c.moveTo(this.x + 1, this.y)
    c.lineTo(this.x - 7, this.y - 3)
    c.lineTo(this.x - 18, this.y + 5)
    c.fillStyle = this.secondaryColor
    c.fill()
    c.closePath()
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

function Enemy() {
  this.x = canvas.width + 100;
  this.y = Math.random() * canvas.height;
  this.super = Math.random() > 0.8
  this.rad = this.super ? randomIntFromRange(90, 120) : randomIntFromRange(15, 20)
  this.life = this.rad * 15

  this.draw = () => {
    c.beginPath()
    c.arc(this.x, this.y, this.rad, 0, Math.PI * 2, false)
    c.fillStyle = 'brown'
    c.fill()
    c.closePath()
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
  this.colors = ['#fff', '#adf', '#fff', '#f0c', '#05f' ]
  this.color = this.colors[Math.floor(Math.random() * this.colors.length)]


  this.draw = () => {
    c.beginPath()
    c.arc(this.x, this.y, 1, 0, Math.PI * 2, false)
    c.fillStyle = this.color;
    c.fill()
    c.closePath()
  }

  this.update = () => {
    this.x -= 8;
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

  if (isPaused) return;

  c.clearRect(0, 0, canvas.width, canvas.height)

  spaceship?.update()

  // Update gunshots
  for (let i = 0; i < gunshots.length; i++) {
    gunshots[i].update()

    if (gunshots[i].x > canvas.width) {
      gunshots.splice(i, 1)
    }
  }

  // Update Stars
  for (let i = 0; i < stars.length; i++) {
    stars[i].update()

    if (stars[i].x < 0) {
      stars.splice(i, 1)
    }
  }

  stars.push(new Star())

  // Chance of spawning new Enemy
  const enemySpawnChance = Math.floor(Math.random() * 1000)
  if (enemySpawnChance < 2) {
    enemies.push(new Enemy())
  }

  // Update Enemies
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].update()

    const spaceShipDistance = getDistance(enemies[i], spaceship)

    if (spaceship && spaceShipDistance - enemies[i].rad <= 0) {
      console.log('hit')
      if (spaceship) spaceship.x -= 60;
      if (spaceship) spaceship.life -= 1;
    }

    for (let j = 0; j < gunshots.length; j++) {
      const distance = getDistance(enemies[i], gunshots[j])

      if (distance < enemies[i]?.rad + gunshots[j]?.rad) {
        enemies[i].life -= 40
        gunshots.splice(j, 1)

        if (enemies[i].life <= 0) {
          enemies.splice(i, 1)
        }
      }
    }

    if (enemies[i]?.x < 0) {
      enemies.splice(i, 1)
    }
  }
}

init()
animate()