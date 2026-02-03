const mapa = document.querySelector(".mapa");
const obj = document.querySelector(".mapaFunc");

let isDragging = false;
let startX = 0, startY = 0;
let translateX = 0, translateY = 0;
let scale = 1;

// --- Desktop drag ---
mapa.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
});

window.addEventListener("mouseup", () => {
    isDragging = false;
});

window.addEventListener("mousemove", e => {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateTransform();
});

// --- Touch drag ---
let isTouchDragging = false;
let touchStartX = 0, touchStartY = 0;
let initialDistance = 0;
let initialScale = scale;

mapa.addEventListener("touchstart", e => {
    if (e.touches.length === 1) {
        isTouchDragging = true;
        touchStartX = e.touches[0].clientX - translateX;
        touchStartY = e.touches[0].clientY - translateY;
    } else if (e.touches.length === 2) {
        isTouchDragging = false; // vypnout posun prstem při pinch
        initialDistance = getDistance(e.touches[0], e.touches[1]);
        initialScale = scale;
    }
});

mapa.addEventListener("touchmove", e => {
    e.preventDefault();
    if (isTouchDragging && e.touches.length === 1) {
        translateX = e.touches[0].clientX - touchStartX;
        translateY = e.touches[0].clientY - touchStartY;
    } else if (e.touches.length === 2) {
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        scale = initialScale * (currentDistance / initialDistance);
        scale = Math.min(Math.max(scale, 0.3), 5);
    }
    updateTransform();
}, { passive: false });

window.addEventListener("touchend", e => {
    if (e.touches.length === 0) isTouchDragging = false;
});

// --- Mouse wheel zoom ---
mapa.addEventListener("wheel", e => {
    e.preventDefault();
    const zoom = e.deltaY < 0 ? 1.1 : 0.9;
    scale *= zoom;
    scale = Math.min(Math.max(scale, 0.3), 5);
    updateTransform();
}, { passive: false });

// --- Pomocná funkce pro pinch ---
function getDistance(touch1, touch2) {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.hypot(dx, dy);
}

// --- Aktualizace transformace ---
function updateTransform() {
    obj.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}
