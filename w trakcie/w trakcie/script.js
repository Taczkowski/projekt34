const scooter = document.getElementById("scooter");
const canvas = document.getElementById("particlesCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let positions = [
    window.innerWidth * 0.15,  // Początek drogi (20%)
    window.innerWidth * 0.475,  // Środek drogi (50%)
    window.innerWidth * 0.8   // Koniec drogi (80%)
];
let index = 0;
let scooterParticles = [];
let smokeParticles = [];
let isMoving = false;

function moveScooter() {
    isMoving = true;
    scooter.style.left = positions[index] + "px";
    if (index === positions.length - 1) {
        index = 0;
    } else {
        index++;
    }
    setTimeout(() => {
        isMoving = false;
    }, 1000);
}

function createScooterParticles(x, y, color) {
    if (scooterParticles.length < 5 && isMoving) {
        scooterParticles.push({
            x: x,
            y: y,
            size: 8,
            opacity: 1,
            color: color,
            speedX: (-Math.random() * 0.2) - 2,
            speedY: (Math.random() - 0.5) * 4,
            growth: Math.random() * 0.1 + 0.05
        });
    }
}

function createSmokeParticles() {
    if (smokeParticles.length < 3) {
        smokeParticles.push({
            x: window.innerWidth / 2 + Math.random() * 40 - 20,
            y: 230,
            size: Math.random() * 20 + 5,
            opacity: 1,
            color: `rgba(139, 58, 58, ${Math.random() * 0.5 + 0.3})`,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: -Math.random() * 1 - 0.5,
            growth: Math.random() * 0.02 + 0.01
        });
    }
}

function updateScooterParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    scooterParticles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.size += p.growth;
        p.opacity -= 0.008;
        ctx.fillStyle = `rgba(139,58,58, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        if (p.opacity <= 0) scooterParticles.splice(i, 1);
    });
}

function updateSmokeParticles() {
    smokeParticles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.size += p.growth;
        p.opacity -= 0.00000000001;
        ctx.fillStyle = `rgb(175, 100, 100)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        if (p.opacity <= 0 || p.y < -p.size) smokeParticles.splice(i, 1);
    });
}

function loop() {
    if (isMoving) {
        createScooterParticles(scooter.offsetLeft + 20, scooter.offsetTop + 50, "#8b4a3d");
    }
    createSmokeParticles();
    updateScooterParticles();
    updateSmokeParticles();
    requestAnimationFrame(loop);
}

loop();

// Dodajemy nasłuchiwanie na zmianę rozmiaru okna, aby dostosować pozycje skutera i cząsteczek
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    positions = [
        window.innerWidth * 0.2,
        window.innerWidth * 0.5,
        window.innerWidth * 0.74
    ];
});