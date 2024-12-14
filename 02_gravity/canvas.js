// UTILS
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)]
}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1
  const yDist = y2 - y1

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

// MAIN

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const gravity = 1;

canvas.width = innerWidth
canvas.height = innerHeight

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}

const colors = ['#264653aa', '#2a9d8faa', '#f4a261aa', '#e76f51aa']

// Event Listeners
addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight

  init()
})

// Objects
class Object {
  constructor(x, y, color) {
    this.x = x
    this.y = y
    this.dy = 2
    this.radius = 30
    this.color = color
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
  }

  update() {
    if (this.y + this.radius + this.dy > innerHeight) {
      this.dy = this.dy * (-0.95);
    } else {
      this.dy = this.dy + gravity;
    }

    this.y = this.y + this.dy

    this.draw()
  }
}

// Implementation
const objects = []

function init() {
  objects.length = 0;

  for (let i = 0; i < 10; i++) {
    const ball = new Object(
      randomIntFromRange(200, canvas.width - 200),
      Math.floor(randomIntFromRange(200, 400) - 30),
      colors[Math.floor(Math.random() * colors.length)]
    )
    objects.push(ball)
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)

  c.fillText('CLICK TO RESTART', mouse.x, mouse.y)
  objects.forEach(object => {
   object.update()
  })
}

init()
animate()

addEventListener('click', () => {
  init()
})