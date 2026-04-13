// El código se ejecuta de forma directa
const totalFrames = 18;
const imgElement = document.getElementById("sequence-img");
const imgContainer = document.querySelector(".image-container");
const lens = document.getElementById("magnifier-lens");

const infoBtn = document.getElementById("info-toggle-btn");
const annotationsLayer = document.getElementById("annotations-layer"); // <-- ¡ESTA ES LA LÍNEA QUE FALTABA!
const frontAnnotations = document.querySelector(".front-annotations");
const leftAnnotations = document.querySelector(".left-annotations");
const rightAnnotations = document.querySelector(".right-annotations");
const topAnnotations = document.querySelector(".top-annotations");
let currentFrameIndex = 1;
let isInfoActive = false;

// 1. Image Preloading
const images = [];
for (let i = 1; i <= totalFrames; i++) {
    const img = new Image();
    img.src = `images/emate_300/${i}.png`; // <-- Ruta correcta
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
    // 1. Ocultamos la capa principal y TODAS las vistas por defecto
    annotationsLayer.classList.remove("show");
    if (frontAnnotations) frontAnnotations.style.display = "none";
    if (leftAnnotations) leftAnnotations.style.display = "none";
    if (rightAnnotations) rightAnnotations.style.display = "none";
    if (topAnnotations) topAnnotations.style.display = "none"; // <-- Ocultamos la nueva vista

    // Si el botón "i" está apagado, nos salimos de la función
    if (!isInfoActive) return;

    // 2. Comprobamos el fotograma EXACTO para mostrar la capa correspondiente
    if (currentFrameIndex === 18) {
        // Vista Frontal
        annotationsLayer.classList.add("show");
        if (frontAnnotations) frontAnnotations.style.display = "block";
    } else if (currentFrameIndex === 4) {
        // Vista Lateral Izquierda
        annotationsLayer.classList.add("show");
        if (leftAnnotations) leftAnnotations.style.display = "block";
    } else if (currentFrameIndex === 10) {
        // Vista Lateral Derecha
        annotationsLayer.classList.add("show");
        if (rightAnnotations) rightAnnotations.style.display = "block";
    } else if (currentFrameIndex === 1) {
        // Vista Superior Cerrada (El Asa)
        annotationsLayer.classList.add("show");
        if (topAnnotations) topAnnotations.style.display = "block";
    }
}

// 3. Scroll Logic
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
        const newSrc = `images/emate_300/${frameIndex}.png`;

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

    let imgX = e.clientX - imgRect.left;
    let imgY = e.clientY - imgRect.top;

    let containerX = e.clientX - containerRect.left;
    let containerY = e.clientY - containerRect.top;

    if (imgX < 0 || imgX > imgRect.width || imgY < 0 || imgY > imgRect.height) {
        lens.style.opacity = 0;
        return;
    } else {
        lens.style.opacity = 1;
    }

    lens.style.left = containerX - lens.offsetWidth / 2 + "px";
    lens.style.top = containerY - lens.offsetHeight / 2 + "px";

    let percX = (imgX / imgRect.width) * 100;
    let percY = (imgY / imgRect.height) * 100;
    lens.style.backgroundPosition = `${percX}% ${percY}%`;
}

imgContainer.addEventListener("mouseenter", () => {
    lens.style.backgroundImage = `url('images/emate_300/${currentFrameIndex}.png')`;
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
    "Newton OS",
    "ARM 710a",
    "Translucent Shell",
    "Educational Mac",
    "Stylus Input",
    "Handwriting Recognition",
    "28-Hour Battery",
    "PCMCIA Slot",
    "Jony Ive Design",
    "Pre-iBook",
    "Clamshell",
    "Grayscale LCD",
    "AppleTalk",
    "IrDA Port",
    "Newton Interconnect",
    "Polycarbonate",
    "1997 Release",
    "Compact Portable"
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
    const wordsToShow = Math.floor((frameIndex / totalFrames) * keywordElements.length);

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
