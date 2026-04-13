// El código ahora se ejecuta de forma directa sin el envoltorio DOMContentLoaded
const totalFrames = 32;
const imgElement = document.getElementById("sequence-img");
const imgContainer = document.querySelector(".image-container");
const lens = document.getElementById("magnifier-lens");

const infoBtn = document.getElementById("info-toggle-btn");
const annotationsLayer = document.getElementById("annotations-layer");
const frontAnnotations = document.querySelector(".front-annotations");
const rearAnnotations = document.querySelector(".rear-annotations");
const rightAnnotations = document.querySelector(".right-annotations");
const leftAnnotations = document.querySelector(".left-annotations");

let currentFrameIndex = 1;
let isInfoActive = false;

// 1. Image Preloading
const images = [];
for (let i = 1; i <= totalFrames; i++) {
    const img = new Image();
    img.src = `images/sony_watchman/${i}.png`;
    images.push(img);
}

// 2. Annotations Button Logic
const bgText = document.getElementById("background-text");

infoBtn.addEventListener("click", () => {
    isInfoActive = !isInfoActive;
    infoBtn.classList.toggle("active");

    // Encendemos o apagamos el efecto blur SOLO en el texto de fondo
    if (bgText) {
        if (isInfoActive) {
            bgText.classList.add("blurred");
        } else {
            bgText.classList.remove("blurred");
        }
    }

    checkAnnotationsVisibility();
});

function checkAnnotationsVisibility() {
    annotationsLayer.classList.remove("show");
    if (frontAnnotations) frontAnnotations.style.display = "none";
    if (rearAnnotations) rearAnnotations.style.display = "none";
    if (rightAnnotations) rightAnnotations.style.display = "none";
    if (leftAnnotations) leftAnnotations.style.display = "none";

    if (!isInfoActive) return;

    const frontFrames = [8, 26, 27, 28, 29, 30, 31, 32];
    const rearFrames = [14, 15, 16, 17, 18, 19, 20];
    const rightFrames = [11];
    const leftFrames = [23];

    if (frontFrames.includes(currentFrameIndex)) {
        annotationsLayer.classList.add("show");
        if (frontAnnotations) frontAnnotations.style.display = "block";
    } else if (rearFrames.includes(currentFrameIndex)) {
        annotationsLayer.classList.add("show");
        if (rearAnnotations) rearAnnotations.style.display = "block";
    } else if (rightFrames.includes(currentFrameIndex)) {
        annotationsLayer.classList.add("show");
        if (rightAnnotations) rightAnnotations.style.display = "block";
    } else if (leftFrames.includes(currentFrameIndex)) {
        annotationsLayer.classList.add("show");
        if (leftAnnotations) leftAnnotations.style.display = "block";
    }
}

// 3. Scroll Logic (Millimetric precision)
window.addEventListener("scroll", () => {
    const scrollTrack = document.querySelector(".scroll-track");
    if (!scrollTrack) return;
    const trackTop = scrollTrack.offsetTop;
    const trackScrollableDistance = scrollTrack.offsetHeight - window.innerHeight;

    let currentScroll = window.scrollY - trackTop;

    if (currentScroll < 0) currentScroll = 0;
    if (currentScroll > trackScrollableDistance) currentScroll = trackScrollableDistance;

    const scrollFraction = currentScroll / trackScrollableDistance;
    let frameIndex = Math.floor(scrollFraction * (totalFrames - 1)) + 1;

    if (frameIndex < 1) frameIndex = 1;
    if (frameIndex > totalFrames) frameIndex = totalFrames;

    if (frameIndex !== currentFrameIndex) {
        currentFrameIndex = frameIndex;
        const newSrc = `images/sony_watchman/${frameIndex}.png`;

        requestAnimationFrame(() => {
            imgElement.src = newSrc;
            lens.style.backgroundImage = `url('${newSrc}')`;
            checkAnnotationsVisibility();
            updateKeywords(frameIndex);
        });
    }
});

// 4. Magnifier Lens Logic
function moveMagnifier(e) {
    const imgRect = imgElement.getBoundingClientRect();
    const containerRect = imgContainer.getBoundingClientRect();

    // Coordenadas respecto a la imagen (zoom interno)
    let imgX = e.clientX - imgRect.left;
    let imgY = e.clientY - imgRect.top;

    // Coordenadas respecto al contenedor (posición física de la lupa)
    let containerX = e.clientX - containerRect.left;
    let containerY = e.clientY - containerRect.top;

    // Oculta la lupa si sale de los límites de la imagen
    if (imgX < 0 || imgX > imgRect.width || imgY < 0 || imgY > imgRect.height) {
        lens.style.opacity = 0;
        return;
    } else {
        lens.style.opacity = 1;
    }

    // Posiciona el cuadrado de la lupa en el ratón
    lens.style.left = containerX - lens.offsetWidth / 2 + "px";
    lens.style.top = containerY - lens.offsetHeight / 2 + "px";

    // Mueve el fondo del zoom
    let percX = (imgX / imgRect.width) * 100;
    let percY = (imgY / imgRect.height) * 100;
    lens.style.backgroundPosition = `${percX}% ${percY}%`;
}
// Activar la lupa en el Watchman
imgContainer.addEventListener("mouseenter", () => {
    lens.style.backgroundImage = `url('images/sony_watchman/${currentFrameIndex}.png')`;
    lens.style.opacity = 1;
});
imgContainer.addEventListener("mouseleave", () => (lens.style.opacity = 0));
imgContainer.addEventListener("mousemove", moveMagnifier);

// 5. Video Button Logic
const videoBtn = document.querySelector(".btn-video");
const videoOverlay = document.getElementById("video-overlay");
const videoPlayer = document.getElementById("main-video"); // Este ahora es tu iframe
let isVideoActive = false;

// Guardamos la URL base del vídeo para usar el truco de apagado
const iframeSrc = videoPlayer.src;

videoBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    isVideoActive = !isVideoActive;
    videoBtn.classList.toggle("active");

    if (isVideoActive) {
        // Al ABRIR el vídeo
        videoOverlay.classList.add("show");
        videoBtn.innerHTML = "&#10006;";

        // Magia extra: Le añadimos el parámetro autoplay para que arranque solo al abrir la ventana
        if (!videoPlayer.src.includes("autoplay=1")) {
            videoPlayer.src = iframeSrc + (iframeSrc.includes("?") ? "&" : "?") + "autoplay=1";
        }
    } else {
        // Al CERRAR el vídeo
        videoOverlay.classList.remove("show");
        videoBtn.innerHTML = "&#9658;";

        // EL TRUCO: Al resetear el src a su estado original, forzamos a YouTube a detenerse
        videoPlayer.src = iframeSrc;
    }
});

videoOverlay.addEventListener("click", (e) => {
    if (e.target === videoOverlay) videoBtn.click();
});

videoOverlay.addEventListener("click", (e) => {
    if (e.target === videoOverlay) videoBtn.click();
});

// 6. Progressive Keywords Logic
const keywordsData = [
    "Flat CRT",
    "Analog Tuner",
    "Telescopic Antenna",
    "High Voltage",
    "Portable Media",
    "ABS Plastic",
    "Parallel Electron Gun",
    "VHF/UHF Bands",
    "6V DC Input",
    "Pocket Television",
    "Mechanical Dial",
    "Power Compartment",
    "Tactile Switches",
    "Front-Firing Speaker",
    "Monochrome Display",
    "Miniaturization",
    "Consumer Tech",
    "1982 Release",
    "Flyback Transformer",
    "Hardware Design"
];

const container = document.getElementById("keywords-list");
keywordsData.forEach((text) => {
    const span = document.createElement("span");
    span.className = "keyword";
    span.textContent = text;
    container.appendChild(span);
});

const keywordElements = document.querySelectorAll(".keyword");

function updateKeywords(frameIndex) {
    const wordsToShow = Math.floor((frameIndex / 32) * keywordElements.length);

    keywordElements.forEach((el, index) => {
        if (el.id === "product-title") return;

        if (index < wordsToShow) {
            el.classList.add("visible");
        } else {
            el.classList.remove("visible");
        }
    });
}

// =========================================
// 7. LÓGICA RESPONSIVE PARA ANOTACIONES
// =========================================
function adjustAnnotationsScale() {
    const imgElement = document.getElementById("sequence-img");
    const annotationsLayer = document.getElementById("annotations-layer");

    if (!imgElement || !annotationsLayer) return;

    const referenceHeight = 783;

    if (!imgElement.naturalWidth) {
        setTimeout(adjustAnnotationsScale, 50);
        return;
    }

    const rect = imgElement.getBoundingClientRect();
    const imgAspect = imgElement.naturalWidth / imgElement.naturalHeight;
    const containerAspect = rect.width / rect.height;

    let realDrawnHeight;

    if (containerAspect > imgAspect) {
        realDrawnHeight = rect.height;
    } else {
        realDrawnHeight = rect.width / imgAspect;
    }

    const scale = realDrawnHeight / referenceHeight;
    annotationsLayer.style.setProperty("--scale", scale);
}

window.addEventListener("resize", adjustAnnotationsScale);
window.addEventListener("load", adjustAnnotationsScale);
adjustAnnotationsScale();
