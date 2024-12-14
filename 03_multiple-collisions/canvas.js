// UTILS
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)]
}

function getDistance(one, two) {
  const xDist = one.x - two.x
  const yDist = one.y - two.y

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

function rotate(velocity, angle) {
  const rotatedVelocities = {
      x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
      y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
  };

  return rotatedVelocities;
}

function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

      // Grab angle between the two colliding particles
      const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

      // Store mass in var for better readability in collision equation
      const m1 = particle.mass;
      const m2 = otherParticle.mass;

      // Velocity before equation
      const u1 = rotate(particle.velocity, angle);
      const u2 = rotate(otherParticle.velocity, angle);

      // Velocity after 1d collision equation
      const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
      const v2 = { x: u2.x * (m2 - m1) / (m1 + m2) + u1.x * 2 * m1 / (m1 + m2), y: u2.y };

      // Final velocity after rotating axis back to original location
      const vFinal1 = rotate(v1, -angle);
      const vFinal2 = rotate(v2, -angle);

      // Swap particle velocities for realistic bounce effect
      particle.velocity.x = vFinal1.x;
      particle.velocity.y = vFinal1.y;

      otherParticle.velocity.x = vFinal2.x;
      otherParticle.velocity.y = vFinal2.y;
  }
}

// MAIN

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const gravity = 1;
let errorCount = 0;

canvas.width = innerWidth
canvas.height = innerHeight

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}

const colors = [
  '#264653',
  '#2a9d8f',
  '#f4a261',
  '#e76f51'
]

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

addEventListener('click', () => {
  init()
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

// Implementation
const particles = []

function init() {
  errorCount = 0
  particles.length = 0;

  for (let i = 0; i < 200; i++) {
    const rad = randomIntFromRange(5, 25)
    const color = randomColor(colors)
    let x = randomIntFromRange(rad, canvas.width - rad)
    let y = randomIntFromRange(rad, canvas.height - rad)

    if (particles.length) {
      for (let j = 0; j < particles.length; j++) {
        const distance = getDistance(particles[j], {x, y}) - (particles[j].radius + rad)

        if (distance < 0 && errorCount < 1000) {
          console.log('try again - bad place')
          errorCount++
          x = randomIntFromRange(rad, canvas.width - rad)
          y = randomIntFromRange(rad, canvas.height - rad)

          j = -1
        }

        if (errorCount >= 1000) {
          window.alert('not enough space')
        }
      }
    } 

    particles.push(new Particle(x, y, color, rad))
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)

  for (let i = 0; i < particles.length; i++) {
    particles[i].update(particles)
  }
}

init()
animate()