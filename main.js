let DEV = true;

let showPath = false;
let showTile = false;
let showSubtiles = false;
let showVelocity = false;
let showCollided = false;
let showPolygon = false;

function checkDev() {
    if (DEV) {
        $("debug").style.display = "block";
        showPath = $("showPathTick").checked;
        showTile = $("showTileTick").checked;
        showSubtiles = $("showSubtileTick").checked;
        showVelocity = $("showVelocityTick").checked;
        showCollided = $("showCollisionTick").checked;
        showPolygon = $("showPolygonTick").checked;
    
        $("showPathTick").addEventListener("change", () => showPath = $("showPathTick").checked);
        $("showTileTick").addEventListener("change", () => showTile = $("showTileTick").checked);
        $("showSubtileTick").addEventListener("change", () => showSubtiles = $("showSubtileTick").checked);
        $("showVelocityTick").addEventListener("change", () => showVelocity = $("showVelocityTick").checked);
        $("showCollisionTick").addEventListener("change", () => showCollided = $("showCollisionTick").checked);
        $("showPolygonTick").addEventListener("change", () => showPolygon = $("showPolygonTick").checked);
    } else {
        $("debug").style.display = "none";
        showPath = false;
        showTile = false;
        showSubtiles = false;
        showVelocity = false;
        showCollided = false;
        showPolygon = false;
    }
}

let controls = {
    forward: false,
    reverse: false,
    left: false,
    right: false,
    break: false,
};

document.onkeydown = (event) => {
    switch (event.key.toLowerCase()) {
        case 'w' || 'arrowup':
            controls.forward = true;
            break;
        case 's' || 'arrowdown':
            controls.reverse = true;
            break;
        case 'a' || 'arrowleft':
            controls.left = true;
            break;
        case 'd' || 'arrowright':
            controls.right = true;
            break;
        case ' ':
            controls.break = true;
            break;
        case 'esc':
            // Pause and stuff
            break;
    }
    if (game) game.updateControls(controls);
};

document.onkeyup = (event) => {
    switch (event.key.toLowerCase()) {
        case 'w' || 'arrowup':
            controls.forward = false;
            break;
        case 's' || 'arrowdown':
            controls.reverse = false;
            break;
        case 'a' || 'arrowleft':
            controls.left = false;
            break;
        case 'd' || 'arrowright':
            controls.right = false;
            break;
        case ' ':
            controls.break = false;
            break;
    }
    if (game) game.updateControls(controls);
};

const carCanvas = document.getElementById('carCanvas');
const carCtx = carCanvas.getContext('2d');

carCanvas.width = window.innerWidth;
carCanvas.height = window.innerHeight;

let game = new Game();

game.start();