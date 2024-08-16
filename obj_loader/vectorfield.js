console.log('Vector field script loaded');

const canvas = document.getElementById('vector-field');
console.log('Vector field canvas:', canvas);
const ctx = canvas.getContext('2d');

let width, height;
let mouseX = 0, mouseY = 0;

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    console.log('Canvas dimensions:', canvas.width, canvas.height);
    initVectors();
}

class Vector {
    constructor(x, y) {
        this.baseX = x;
        this.baseY = y;
        this.tipX = x;
        this.tipY = y;
    }

    update() {
        const dx = mouseX - this.baseX;
        const dy = mouseY - this.baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 800; // Increase this value
        
        if (distance < maxDistance) {
            const angle = Math.atan2(dy, dx);
            const strength = 1 - distance / maxDistance;
            this.tipX = this.baseX + Math.cos(angle) * 8 * strength; // Increase from 5 to 20
            this.tipY = this.baseY + Math.sin(angle) * 8 * strength; // Increase from 5 to 20
        } else {
            this.tipX = this.baseX;
            this.tipY = this.baseY;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.baseX, this.baseY);
        ctx.lineTo(this.tipX, this.tipY);
        ctx.stroke();
    }
}

const vectors = [];
const gridSize = 20;

function initVectors() {
    vectors.length = 0;
    for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
            vectors.push(new Vector(x, y));
        }
    }
}

function animate() {
    console.log('Vector field animating');
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
    ctx.lineWidth = 1;

    vectors.forEach(vector => {
        vector.update();
        vector.draw();
    });

    requestAnimationFrame(animate);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.updateVectorFieldMouse = function(x, y) {
    mouseX = x;
    mouseY = y;
};

animate();