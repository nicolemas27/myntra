// Open and close the size modal
function openSizeModal() {
    document.getElementById('size-modal').style.display = "block";
}

function closeSizeModal() {
    document.getElementById('size-modal').style.display = "none";
}

// Show body types
function showBodyTypes() {
    document.getElementById('body-types').style.display = "block";
    document.getElementById('custom-measurements').style.display = "none";
}

// Show custom measurements
function showCustomMeasurements() {
    document.getElementById('body-types').style.display = "none";
    document.getElementById('custom-measurements').style.display = "block";
}

// Apply body type
function selectBodyType(bodyType) {
    console.log(`Selected body type: ${bodyType}`);
    adjustModelByBodyType(bodyType);
    closeSizeModal();
}

// Apply measurements
function applyMeasurements() {
    const height = document.getElementById('height').value;
    const chest = document.getElementById('chest').value;
    const waist = document.getElementById('waist').value;
    const hips = document.getElementById('hips').value;

    console.log("Measurements applied: ", { height, chest, waist, hips });
    adjustModel({ height, chest, waist, hips });
    closeSizeModal();
}

// Adjust the model based on body type
function adjustModelByBodyType(bodyType) {
    console.log(`Adjusting model to ${bodyType} body type`);
}

// Adjust the model based on measurements
function adjustModel(measurements) {
    const { height, chest, waist, hips } = measurements;
    console.log(`Adjusting model with height: ${height}, chest: ${chest}, waist: ${waist}, hips: ${hips}`);
}

// Drawing on canvas
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let drawing = false;
let lastX = 0;
let lastY = 0;

// Start drawing
function startDrawing(x, y) {
    drawing = true;
    [lastX, lastY] = [x, y];
}

let currentPen = 'basic'; // Default pen style
let isEraserActive = false;

// Toggle pen menu
function togglePenMenu() {
    const menu = document.getElementById('pen-menu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// Select pen style
function selectPen(pen) {
    currentPen = pen;
    isEraserActive = false;
    console.log(`Selected pen: ${currentPen}`);
    document.getElementById('pen-menu').style.display = 'none';
}

// Select eraser
function selectEraser() {
    isEraserActive = true;
    console.log(`Eraser selected`);
}

// Change color
function changeColor(color) {
    if (!isEraserActive) {
        context.strokeStyle = color;
    }
}

// Draw with different pen styles
function draw(x, y) {
    if (!drawing) return;

    context.beginPath();
    context.moveTo(lastX, lastY);
    context.strokeStyle = isEraserActive ? "#FFFFFF" : document.getElementById('color-wheel').value;

    switch (currentPen) {
        case 'soft':
            context.lineWidth = 5;
            context.globalAlpha = 0.5;
            break;
        case 'textured':
            context.strokeStyle = createPattern();
            context.lineWidth = 3;
            break;
        case 'bold':
            context.lineWidth = 6;
            break;
        case 'dashed':
            context.setLineDash([10, 5]);
            context.lineWidth = 2;
            break;
        default:
            context.lineWidth = 2;
            context.setLineDash([]);
            break;
    }

    context.lineTo(x, y);
    context.stroke();
    [lastX, lastY] = [x, y];

    if (currentPen === 'soft') {
        context.globalAlpha = 1.0;
    }
}

// Stop drawing
function stopDrawing() {
    drawing = false;
}

// Mouse events
canvas.addEventListener('mousedown', (e) => startDrawing(e.offsetX, e.offsetY));
canvas.addEventListener('mousemove', (e) => draw(e.offsetX, e.offsetY));
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Touch events
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    startDrawing(touch.clientX - rect.left, touch.clientY - rect.top);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    draw(touch.clientX - rect.left, touch.clientY - rect.top);
});

canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchcancel', stopDrawing);

// Clear canvas
document.getElementById('clear-canvas').addEventListener('click', function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
});

// Load categories and add silhouettes/tops/bottoms/etc.
function loadCategory(category) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas for new images

    switch (category) {
        case 'silhouettes':
            displaySilhouettes();
            break;
        case 'tops':
            displayTops();
            break;
        case 'bottoms':
            displayBottoms();
            break;
        case 'necklines':
            displayNecklines();
            break;
        default:
            break;
    }
}

function displaySilhouettes() {
    const silhouettes = [
        '2dimages/Silhouettes/1.png',
        '2dimages/Silhouettes/2.png',
        '2dimages/Silhouettes/5.png'
    ];

    showImages(silhouettes);
}

function displayTops() {
    const tops = [
        '2dimages/tops/jacket.jpg',
        '2dimages/tops/4.png',
        '2dimages/tops/3.png',
        '2dimages/tops/13.png',
    ];

    showImages(tops);
}

function displayBottoms() {
    const bottoms = [
        '2dimages/bottoms/flare.jpg',
        '2dimages/bottoms/skirt.jpg',
        '2dimages/bottoms/skirt2.jpg',
        '2dimages/bottoms/skirt3.jpg',
        '2dimages/bottoms/cargo.jpg'
    ];

    showImages(bottoms);
}

function displayNecklines() {
    const necklines = [
        '2dimages/neckline1.png',
        '2dimages/neckline2.png',
        '2dimages/neckline3.png'
    ];

    showImages(necklines);
}

function showImages(images) {
    const silhouettesContainer = document.createElement('div');
    silhouettesContainer.className = 'silhouettes-container';

    // Clear existing images in the container
    const mainContent = document.querySelector('.main-content');
    const existingContainer = document.querySelector('.silhouettes-container');
    if (existingContainer) {
        existingContainer.remove();
    }

    images.forEach((src) => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'silhouette-image';
        img.onclick = () => addToCanvas(src);
        silhouettesContainer.appendChild(img);
    });

    mainContent.appendChild(silhouettesContainer);
}


function addToCanvas(src) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = src;
    img.onload = () => {
        ctx.drawImage(img, 50, 50, 200, 300); // Adjust the position and size as needed
    };
}

// Optional: Create pattern function for textured pen
function createPattern() {
    // Define pattern logic if needed
    return "#ccc"; // Placeholder pattern
}
