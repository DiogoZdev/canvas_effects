// RECTANGLE
c.beginPath();
c.fillStyle = "rgba(255,0,0,0.5)"
c.fillRect(0, 0, 200, 200);
c.closePath();

// LINE
c.beginPath();
c.moveTo(50, 150);
c.strokeStyle = "green";
c.lineTo(300, 100);
c.moveTo(600, 200);
c.strokeStyle = "blue";
c.lineTo(400, 300);
c.stroke();
c.closePath();

// CIRCLE
c.beginPath(); // used so element do not connect with previous one
c.fillStyle = color;
c.arc(10, 10, 10, 0, Math.PI*2 , false);
c.fill()
c.closePath();

// TIANGLE
c.beginPath();
c.moveTo(75, 50);
c.lineTo(100, 75);
c.lineTo(100, 25);
c.fill();
c.closePath();
