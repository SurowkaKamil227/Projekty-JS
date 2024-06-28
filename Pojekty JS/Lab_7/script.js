document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const numBallsInput = document.getElementById('numBalls');
    const lineDistanceInput = document.getElementById('lineDistance');
    const forceStrengthInput = document.getElementById('forceStrength');

    let balls = [];
    let animationId;
    let mouseX = 0;
    let mouseY = 0;
    let isMouseDown = false;

    class Ball {
        constructor(x, y, radius, dx, dy) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.dx = dx;
            this.dy = dy;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = 'blue';
            ctx.fill();
            ctx.closePath();
        }

        update() {
            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                this.dx = -this.dx;
            }
            if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
                this.dy = -this.dy;
            }
            this.x += this.dx;
            this.y += this.dy;
        }

        applyForce(fx, fy) {
            this.dx += fx;
            this.dy += fy;
        }
    }

    function init() {
        balls = [];
        const numBalls = parseInt(numBallsInput.value, 10);
        for (let i = 0; i < numBalls; i++) {
            const radius = 10;
            const x = Math.random() * (canvas.width - radius * 2) + radius;
            const y = Math.random() * (canvas.height - radius * 2) + radius;
            const dx = (Math.random() - 0.5) * 2;
            const dy = (Math.random() - 0.5) * 2;
            balls.push(new Ball(x, y, radius, dx, dy));
        }
    }

    function drawLines() {
        const lineDistance = (parseInt(lineDistanceInput.value, 10) / 100) * canvas.width;
        for (let i = 0; i < balls.length; i++) {
            for (let j = i + 1; j < balls.length; j++) {
                const dist = Math.hypot(balls[i].x - balls[j].x, balls[i].y - balls[j].y);
                if (dist < lineDistance) {
                    ctx.beginPath();
                    ctx.moveTo(balls[i].x, balls[i].y);
                    ctx.lineTo(balls[j].x, balls[j].y);
                    ctx.strokeStyle = 'black';
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    }

    function animate() {
        animationId = requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        balls.forEach(ball => {
            ball.update();
            ball.draw();
        });
        drawLines();
        applyMouseForce();
    }

    function applyMouseForce() {
        const forceStrength = parseFloat(forceStrengthInput.value);
        balls.forEach(ball => {
            const dist = Math.hypot(ball.x - mouseX, ball.y - mouseY);
            if (dist < 100) {
                const angle = Math.atan2(ball.y - mouseY, ball.x - mouseX);
                const fx = Math.cos(angle) * forceStrength / dist;
                const fy = Math.sin(angle) * forceStrength / dist;
                ball.applyForce(fx, fy);
            }
        });
    }

    function handleMouseMove(event) {
        mouseX = event.clientX - canvas.offsetLeft;
        mouseY = event.clientY - canvas.offsetTop;
    }

    function handleMouseClick(event) {
        const clickX = event.clientX - canvas.offsetLeft;
        const clickY = event.clientY - canvas.offsetTop;
        for (let i = 0; i < balls.length; i++) {
            const ball = balls[i];
            const dist = Math.hypot(ball.x - clickX, ball.y - clickY);
            if (dist < ball.radius) {
                balls.splice(i, 1);
                addNewBalls();
                break;
            }
        }
    }

    function addNewBalls() {
        for (let i = 0; i < 2; i++) {
            const radius = 10;
            const x = Math.random() * (canvas.width - radius * 2) + radius;
            const y = Math.random() * (canvas.height - radius * 2) + radius;
            const dx = (Math.random() - 0.5) * 2;
            const dy = (Math.random() - 0.5) * 2;
            balls.push(new Ball(x, y, radius, dx, dy));
        }
    }

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleMouseClick);

    startBtn.addEventListener('click', () => {
        cancelAnimationFrame(animationId);
        init();
        animate();
    });

    resetBtn.addEventListener('click', () => {
        cancelAnimationFrame(animationId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        balls = [];
    });

    // Initialize with default values
    init();
    animate();
});