const scooter = document.getElementById("scooter");
const canvas = document.getElementById("particlesCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Zmienione pozycje: początek drogi, środek drogi i koniec drogi
let positions = [
    window.innerWidth * 0.2,  // Początek drogi (20%)
    window.innerWidth * 0.5,  // Środek drogi (50%)
    window.innerWidth * 0.74   // Koniec drogi (80%)
];
let index = 0;
let scooterParticles = []; // Cząsteczki skutera
let smokeParticles = []; // Cząsteczki dymu z komina
let isMoving = false; // Flaga, aby śledzić, czy skuter się porusza

function moveScooter() {
    isMoving = true; // Ustaw flagę na true, gdy skuter się porusza
    scooter.style.left = positions[index] + "px";
    if (index === positions.length - 1) {
        index = 0; // Zresetuj indeks, aby skuter wrócił na początek
    } else {
        index++;
    }
    setTimeout(() => {
        isMoving = false; // Ustaw flagę na false po zakończeniu ruchu
    }, 6000); // Czas trwania animacji skutera
}

function createScooterParticles(x, y, color) {
    if (scooterParticles.length < 5 && isMoving) { // Zwiększona liczba cząsteczek
        scooterParticles.push({
            x: x,
            y: y,
            size: 8, // Zwiększony rozmiar cząsteczek
            opacity: 1,
            color: color,
            speedX: (-Math.random() * 0.2) - 2, // Zwiększona prędkość w osi X
            speedY: (Math.random() - 0.5) * 4, // Zwiększona prędkość w osi Y
            growth: Math.random() * 0.1 + 0.05 // Zwiększony wzrost cząsteczek
        });
    }
}

function createSmokeParticles() {
    if (smokeParticles.length < 3) { // Ogranicz liczbę cząsteczek dymu
        smokeParticles.push({
            x: window.innerWidth / 2 + Math.random() * 40 - 20, // Losowe pozycje wokół komina
            y: 300, // Początkowa pozycja Y (na wysokości komina)
            size: Math.random() * 20 + 5, // Losowe rozmiary
            opacity: 1,
            color: `rgba(139, 58, 58, ${Math.random() * 0.5 + 0.3})`, // Kolor dymu (czerwony)
            speedX: (Math.random() - 0.5) * 0.5, // Lekkie przesunięcie w osi X
            speedY: -Math.random() * 1 - 0.5, // Poruszanie się do góry
            growth: Math.random() * 0.02 + 0.01 // Powolne powiększanie się
        });
    }
}

function updateScooterParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    scooterParticles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.size += p.growth;
        p.opacity -= 0.008; // Szybsze zanikanie cząsteczek
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
        p.opacity -= 0.00000000001; // Powolne zanikanie
        ctx.fillStyle = `rgb(175, 100, 100)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        if (p.opacity <= 0 || p.y < -p.size) smokeParticles.splice(i, 1); // Usuń cząsteczki, które zniknęły
    });
}

function loop() {
    if (isMoving) {
        createScooterParticles(scooter.offsetLeft + 20, scooter.offsetTop + 50, "#8b4a3d");
    }
    createSmokeParticles(); // Dodaj cząsteczki dymu
    updateScooterParticles(); // Aktualizuj cząsteczki skutera
    updateSmokeParticles(); // Aktualizuj cząsteczki dymu
    requestAnimationFrame(loop);
}

loop();