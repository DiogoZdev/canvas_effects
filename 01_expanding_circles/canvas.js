
// indetify canvas and create context to manipulate elements in it
const canvas = document.querySelector('#canvas'); // locate HTML canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const c = canvas.getContext('2d'); // c => context


// EVENTS LISTENERS
window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
})

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

// CONSTANT VALUES
const mouse = {
    x: null,
    y: null
}
const circles = []
const colors = [
    '#191919', 
    '#941b0c', 
    '#bc3908', 
    '#f6aa1c'
];
const minRadius = [5, 10, 14]


// ANIMATION FUNCTIONS
function Circle(radius = 40, color) {
    this.x = Math.floor(Math.random() * (window.innerWidth - radius*2)) + radius;
    this.y = Math.floor(Math.random() * (window.innerHeight - radius*2)) + radius;
    this.velocity = {
        x: (Math.random() - 0.5) * 5,
        y: (Math.random() - 0.5) * 5
    }
    this.minRadius = minRadius[Math.floor(Math.random() * minRadius.length)];
    this.radius = radius
    this.growth = 10
    this.originalColor = color
    this.color = 'black';

    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2 , false);
        c.fillStyle = this.color;
        c.fill()
    }

    this.update = function() {
        if (
            this.x + (this.radius/2) >= window.innerWidth ||
            this.x - (this.radius/2) <= 0) {
            this.velocity.x *= -1;
        }
    
        if (
            this.y + (this.radius/2) >= window.innerHeight ||
            this.y - (this.radius/2) <= 0) {
            this.velocity.y *= -1;
        }
    
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y

        // interaction
        const x_distance = Math.abs(mouse.x - this.x)
        const y_distance = Math.abs(mouse.y - this.y)

        if (x_distance < 100 && y_distance < 100) {

            if (this.radius < 30) {
                this.radius += this.growth
            }
            
            if (this.color !== this.originalColor) {
                this.color = this.originalColor
            }
        } else {
            this.color = `${this.originalColor}33`;

            if (this.radius > this.minRadius) {
                this.radius -= 1
            }
        }
    }
}


for (let i = 0; i < 200; i++) {
    const sizes = [10, 15, 20]
    const c = new Circle(
        sizes[Math.floor(Math.random() * sizes.length)],
        colors[Math.floor(Math.random() * colors.length)]);

    circles.push(c)
}

function animate() {
    requestAnimationFrame(animate);

    c.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < circles.length; i++) {
        circles[i].draw();
        circles[i].update();
    }
}

animate();