const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let bubbles = []; // Tablica do przechowywania bombelków
let roadY; // Pozycja Y drogi
let circleRadius; // Promień okręgu
let motorImage = new Image(); // Obrazek motocykla
motorImage.src = 'motor.svg'; // Ścieżka do obrazka
let motorPosition = 0; // Pozycja motocykla (0 - początek, 1 - środek, 2 - koniec)
let currentMotorX; // Aktualna pozycja X motocykla
const motorWidth = canvas.width * 0.2; // Szerokość motocykla
const motorHeight = canvas.width * 0.2; // Wysokość motocykla
const maxSpeed = 2; // Maksymalna prędkość motocykla
let currentSpeed = 0; // Aktualna prędkość motocykla
const acceleration = 0.5; // Przyspieszenie
const deceleration = 0.5; // Hamowanie

// Funkcja do ustawiania rozmiaru canvasu
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawRoad(); // Rysowanie drogi po zmianie rozmiaru
}

// Funkcja do rysowania drogi
function drawRoad() {
    const roadWidth = canvas.width * 0.5; // Szerokość drogi na 50% szerokości canvasu
    const roadHeight = 50; // Wysokość drogi
    roadY = (canvas.height / 2 - roadHeight / 2) + 140; // Pozycja Y drogi

    // Wyczyść canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Rysowanie drogi
    ctx.fillStyle = '#94524d'; // Kolor drogi
    ctx.strokeStyle = '#94524d'; // Kolor konturu
    ctx.lineWidth = 5; // Grubość konturu

    ctx.beginPath();
    ctx.moveTo(60, roadY + roadHeight / 2); // Początek drogi
    ctx.lineTo(canvas.width - 60, roadY + roadHeight / 2); // Koniec drogi
    ctx.lineWidth = roadHeight; // Ustawienie grubości linii
    ctx.lineJoin = 'round'; // Zaokrąglenie krawędzi
    ctx.lineCap = 'round'; // Zaokrąglenie końców
    ctx.stroke(); // Rysowanie konturu

    // Rysowanie prostokąta z nową szerokością
    ctx.fillRect((canvas.width - roadWidth) / 2, roadY, roadWidth, roadHeight); // Rysowanie drogi na środku

    // Rysowanie okręgu
    circleRadius = Math.min(canvas.width * 0.09, canvas.width * 0.09); // Promień okręgu
    const circleX = canvas.width / 2; // Pozycja X okręgu
    const circleY = roadY - circleRadius; // Pozycja Y okręgu

    ctx.fillStyle = '#94524d'; // Kolor okręgu
    ctx.beginPath();
    ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2); // Rysowanie okręgu
    ctx.fill(); // Wypełnienie okręgu
    ctx.stroke(); // Kontur okręgu

    // Rysowanie prostokąta (komina)
    const rectWidth = canvas.width * 0.075; // Szerokość prostokąta
    const rectHeight = canvas.height * 0.04; // Wysokość prostokąta
    const rectX = circleX - rectWidth / 2; // Pozycja X prostokąta
    const rectY = circleY - circleRadius - rectHeight; // Pozycja Y prostokąta

    ctx.fillStyle = '#94524d'; // Kolor prostokąta
    ctx.beginPath();
    const radius = 10; // Promień zaokrąglenia rogów
    ctx.moveTo(rectX + radius, rectY); // Początek
    ctx.lineTo(rectX + rectWidth - radius, rectY); // Górna krawędź
    ctx.quadraticCurveTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + radius); // Prawy górny róg
    ctx.lineTo(rectX + rectWidth, rectY + rectHeight - radius); // Prawa krawędź
    ctx.quadraticCurveTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - radius, rectY + rectHeight); // Prawy dolny róg
    ctx.lineTo(rectX + radius, rectY + rectHeight); // Dolna krawędź
    ctx.quadraticCurveTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - radius); // Lewy dolny róg
    ctx.lineTo(rectX, rectY + radius); // Lewa krawędź
    ctx.quadraticCurveTo(rectX, rectY, rectX + radius, rectY); // Lewy górny róg
    ctx.closePath(); // Zamknięcie ścieżki
    ctx.fill(); // Wypełnienie prostokąta
}

// Funkcja do rysowania bombelków
function drawBubbles() {
    for (let i = 0; i < bubbles.length; i++) {
        const bubble = bubbles[i];
        ctx.fillStyle = `rgba(148, 82, 77, ${bubble.alpha})`; // Kolor z przezroczystością
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Funkcja do aktualizacji bombelków
function updateBubbles() {
    for (let i = bubbles.length - 1; i >= 0; i--) {
        const bubble = bubbles[i];
        bubble.y -= bubble.speed; // Przemieszczanie w górę
        bubble.x += bubble.direction; // Buja się w lewo/prawo
        bubble.alpha -= 0.001; // Zmniejszanie przezroczystości

        // Usuwanie bombelków, które zniknęły
        if (bubble.alpha <= 0) {
            bubbles.splice(i, 1);
        }
    }
}

// Funkcja do generowania bombelków
function createBubble() {
    const circleX = canvas.width / 2; // Pozycja X okręgu
    const circleY = roadY - circleRadius; // Pozycja Y okręgu
    const radius = Math.random() * (canvas.width * 0.03); // Losowy promień bombelka
    const speed = Math.random() * 1 + 0.5; // Losowa prędkość
    const direction = (Math.random() - 0.5) * 0.3; // Losowy kierunek bujania

    bubbles.push({
        x: circleX,
        y: circleY,
        radius: radius,
        speed: speed,
        direction: direction,
        alpha: 1 // Początkowa przezroczystość
    });
}

// Funkcja do rysowania motocykla
function drawMotor() {
    const roadWidth = canvas.width * 0.8; // Szerokość drogi

    // Ustal docelową pozycję motocykla
    let targetX;
    if (motorPosition === 0) {
        targetX = (canvas.width - roadWidth) / 2; // Początek drogi
    } else if (motorPosition === 1) {
        targetX = (canvas.width - roadWidth) / 2 + (roadWidth - motorWidth) / 2; // Środek drogi
    } else {
        targetX = (canvas.width - roadWidth) / 2 + roadWidth - motorWidth; // Koniec drogi
    }

// Płynne przesuwanie motocykla
if (currentMotorX === undefined) {
    currentMotorX = targetX; // Inicjalizacja aktualnej pozycji
}

// Przyspieszanie lub hamowanie
if (Math.abs(currentMotorX - targetX) > 1) {
    if (currentSpeed < maxSpeed) {
        currentSpeed += acceleration; // Przyspieszanie
    }
} else {
    if (currentSpeed > 0) {
        currentSpeed -= deceleration; // Hamowanie
    }
}

// Ustawienie nowej pozycji motocykla
if (Math.abs(currentMotorX - targetX) > currentSpeed) {
    currentMotorX += (targetX - currentMotorX) > 0 ? currentSpeed : -currentSpeed;
} else {
    currentMotorX = targetX; // Ustaw na docelową pozycję, gdy blisko
    currentSpeed = 0; // Zatrzymaj motocykla
}
    // Rysowanie motocykla
    ctx.drawImage(motorImage, currentMotorX, roadY - motorHeight, motorWidth, motorHeight); // Rysowanie motocykla z nowymi wymiarami
}

// Funkcja do zmiany pozycji motocykla
function moveMotor() {
    motorPosition = (motorPosition + 1) % 3; // Zmiana pozycji (0 -> 1 -> 2 -> 0)
}

// Funkcja animacji
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Wyczyść canvas
    drawRoad(); // Rysowanie drogi
    drawBubbles(); // Rysowanie bombelków
    updateBubbles(); // Aktualizacja bombelków
    drawMotor(); // Rysowanie motocykla

    // Generowanie bombelków co pewien czas
    if (Math.random() < 0.01) { // Zwiększono prawdopodobieństwo do 20%
        createBubble();
    }

    requestAnimationFrame(animate); // Kontynuacja animacji
}

// Inicjalizacja
window.addEventListener('resize', resizeCanvas); // Obsługa zmiany rozmiaru
resizeCanvas(); // Ustawienie początkowego rozmiaru canvasu
animate(); // Rozpoczęcie animacji

// Obsługa kliknięcia przycisku
document.getElementById('moveButton').addEventListener('click', moveMotor);