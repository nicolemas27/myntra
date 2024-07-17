let undoStack = [];
let redoStack = [];

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
let fillColor = '#000000';

function fillColorInClosedArea() {
    context.fillStyle = fillColor; 
    context.fill();
}

function isAreaClosed() {
    if (pathPoints.length < 3) return false;
    const firstPoint = pathPoints[0];
    const lastPoint = pathPoints[pathPoints.length - 1];

    return (
        Math.abs(firstPoint.x - lastPoint.x) < 5 &&
        Math.abs(firstPoint.y - lastPoint.y) < 5
    );
}

// Start drawing
function startDrawing(x, y) {
    drawing = true;
    [lastX, lastY] = [x / scale - translateX, y / scale - translateY];
    saveState();
}

let currentPen = 'basic'; // Default pen style
let isEraserActive = false;

// Toggle pen menu
function togglePenMenu() {
    const menu = document.getElementById('pen-menu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// Toggle shapes menu
function toggleShapesMenu() {
    const menu = document.getElementById('shapes-menu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// Select pen
function selectPen(pen) {
    currentPen = pen;
    isEraserActive = false; // Deactivate eraser when selecting a pen
    console.log(`Selected pen: ${pen}`);
}
// Select eraser
function selectEraser() {
    isEraserActive = true;
    console.log(`Eraser selected`);
}

// Change color
function changeColor(color) {
    context.strokeStyle = color;
    fillColor = color;
    console.log(`Color changed to: ${color}`);
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
    
    context.lineTo(x / scale - translateX, y / scale - translateY);
    context.stroke();
    [lastX, lastY] = [x / scale - translateX, y / scale - translateY];

    if (currentPen === 'soft') {
        context.globalAlpha = 1.0;
    }
    saveState();
}

// Stop drawing
function stopDrawing() {
    if (!drawing) return;

    drawing = false;
    context.beginPath(); // Clear path
}

// Save canvas state
function saveState() {
    undoStack.push(canvas.toDataURL());
    redoStack = []; // Clear the redo stack
}

// Undo last action
function undo() {
    if (undoStack.length > 0) {
        const state = undoStack.pop();
        redoStack.push(state);
        restoreState(undoStack[undoStack.length - 1]);
    }
}
// Redo last undone action
function redo() {
    if (redoStack.length > 0) {
        const state = redoStack.pop();
        undoStack.push(state);
        restoreState(state);
    }
}

// Restore canvas state
function restoreState(state) {
    const img = new Image();
    img.src = state;
    img.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
    };
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
document.getElementById('clear-canvas').addEventListener('click', () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    saveState(); // Save state for undo
});

// Load categories and add silhouettes/tops/bottoms/etc.
function loadCategory(category) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas for new images

    const imageContainer = document.getElementById('image-container');
    imageContainer.innerHTML = ''; // Clear existing images in the container

    switch (category) {
        case 'silhouettes':
            displaySilhouettes();
            break;
        case 'tops':
            displayTopsImages();
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

const addedImages = new Set(); // To track added images

function displayDressImages() {
    const container = document.getElementById('dress-image-container');
    const dressImages = [
        '2dimages/Silhouettes/1.png',
        '2dimages/Silhouettes/2.png',
        '2dimages/Silhouettes/5.png'
    ];

    if (container.style.display === 'none') {
        container.innerHTML = ''; // Clear previous images
        dressImages.forEach((src) => {
            const img = document.createElement('img');
            img.src = src;
            img.className = 'silhouette-image';
            img.onclick = () => addToCanvas(src);
            container.appendChild(img);
        });
        container.style.display = 'block'; // Show images
    } else {
        container.style.display = 'none'; // Collapse
    }
}

function displayBottomsImages() {
    const container = document.getElementById('bottoms-image-container');
    const bottomsImages = [
        '2dimages/bottoms/flare.jpg',
        '2dimages/bottoms/skirt.jpg',
        '2dimages/bottoms/skirt2.jpg',
        '2dimages/bottoms/skirt3.jpg',
        '2dimages/bottoms/cargo.jpg'
    ];

    if (container.style.display === 'none') {
        container.innerHTML = ''; // Clear previous images
        bottomsImages.forEach((src) => {
            const img = document.createElement('img');
            img.src = src;
            img.className = 'silhouette-image';
            img.onclick = () => addToCanvas(src);
            container.appendChild(img);
        });
        container.style.display = 'block'; // Show images
    } else {
        container.style.display = 'none'; // Collapse
    }
}

function displayTopsImages() {
    const container = document.getElementById('tops-image-container');
    const topsImages = [
        '2dimages/tops/12.png',
        '2dimages/tops/3.png',
        '2dimages/tops/jacket.jpg',
    ];

    if (container.style.display === 'none') {
        container.innerHTML = ''; // Clear previous images
        topsImages.forEach((src) => {
            const img = document.createElement('img');
            img.src = src;
            img.className = 'silhouette-image';
            img.onclick = () => addToCanvas(src);
            container.appendChild(img);
        });
        container.style.display = 'block'; // Show images
    } else {
        container.style.display = 'none'; // Collapse
    }
}


let currentTemplate = {
    src: '',
    width: 100, // default width
    height: 60 // default height
};

function addToCanvas(src) {
    if (!addedImages.has(src)) {
        addedImages.add(src);
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = src;
        img.onload = () => {
            const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
            const newWidth = img.width * scale;
            const newHeight = img.height * scale;

            // Centering the template
            const centerX = (canvas.width / 2) - (newWidth / 2);
            const centerY = (canvas.height / 2) - (newHeight / 2);
            ctx.drawImage(img, centerX, centerY, newWidth, newHeight);
            currentTemplate.src = src;
            currentTemplate.width = newWidth; 
            currentTemplate.height = newHeight;
        };
        saveState();
    }
}


// Utility functions
function createPattern() {
    const patternCanvas = document.createElement('canvas');
    const patternContext = patternCanvas.getContext('2d');
    patternCanvas.width = 10;
    patternCanvas.height = 10;
    patternContext.strokeStyle = context.strokeStyle;
    patternContext.lineWidth = 1;
    patternContext.beginPath();
    patternContext.moveTo(0, 5);
    patternContext.lineTo(10, 5);
    patternContext.stroke();
    patternContext.beginPath();
    patternContext.moveTo(5, 0);
    patternContext.lineTo(5, 10);
    patternContext.stroke();
    return context.createPattern(patternCanvas, 'repeat');
}

let scale = 1; // Initial scale
let translateX = 0; // Horizontal translation
let translateY = 0; // Vertical translation

function zoomCanvas(factor) {
    scale *= factor; // Update scale factor
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Clear and redraw the canvas
    ctx.setTransform(scale, 0, 0, scale, translateX, translateY);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redraw your images or content on the canvas here
    redrawCanvas(ctx);
}

function redrawCanvas(ctx) {
    addedImages.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            const width = img.width * scale;
            const height = img.height * scale;
            ctx.drawImage(img, translateX, translateY, width, height);
        };
    });
}
