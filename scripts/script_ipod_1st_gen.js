document.addEventListener("DOMContentLoaded", () => {
    const totalFrames = 22;
    const imgElement = document.getElementById("sequence-img");
    const imgContainer = document.querySelector(".image-container");
    const lens = document.getElementById("magnifier-lens");

    const infoBtn = document.getElementById("info-toggle-btn");
    const annotationsLayer = document.getElementById("annotations-layer");
    const frontAnnotations = document.querySelector(".front-annotations");
    const rearAnnotations = document.querySelector(".rear-annotations");

    let currentFrameIndex = 1;
    let isInfoActive = false;

    // 1. Image Preloading
    const images = [];
    for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        img.src = `images/ipod_1st_gen/${i}.png`; // <-- AÑADE LA CARPETA AQUÍ
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
        frontAnnotations.style.display = "none";
        rearAnnotations.style.display = "none";

        if (!isInfoActive) return;

        // Front view check
        if (currentFrameIndex === 1 || currentFrameIndex === 13) {
            annotationsLayer.classList.add("show");
            frontAnnotations.style.display = "block";
        }
        // Rear view check
        else if (currentFrameIndex === 14 || currentFrameIndex === 22) {
            annotationsLayer.classList.add("show");
            rearAnnotations.style.display = "block";
        }
    }

    // 3. Scroll Logic (Millimetric precision)
    window.addEventListener("scroll", () => {
        const scrollTrack = document.querySelector(".scroll-track");
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
            const newSrc = `images/ipod_1st_gen/${frameIndex}.png`;

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

    // Activar la lupa en el iPod
    imgContainer.addEventListener("mouseenter", () => {
        lens.style.backgroundImage = `url('images/ipod_1st_gen/${currentFrameIndex}.png')`;
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
});

// 6. Progressive Keywords Logic
const keywordsData = [
    "Dieter Rams",
    "Haptic Feedback",
    "Scroll Wheel",
    "Stainless Steel",
    "Hold Switch",
    "Digital Hub",
    "Mac-Only",
    "Injection Molding",
    "5GB HDD",
    "1,000 Songs",
    "Menu Hierarchy",
    "Hold Switch",
    "Center Button",
    "Physical Rotation",
    "Click Sound",
    "$399 USD",
    "iTunes Sync",
    "Digital Hub",
    "Vertical Lists",
    "Polished Steel",
    "White Polycarbonate",
    "iBook White",
    "Scroll Wheel",
    "Mechanical Wheel",
    "Functionalism Style",
    "Braun T3",
    "Lucite Finish",
    "Chrome Back",
    "Beveled Edges",
    "Precision Assembly"
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
    // Calculamos cuántas palabras mostrar de la lluvia de ideas
    const wordsToShow = Math.floor((frameIndex / 22) * keywordElements.length);

    keywordElements.forEach((el, index) => {
        // Ignoramos el título del producto para que se quede siempre visible y estático
        if (el.id === "product-title") return;

        // Mostramos u ocultamos las keywords según el scroll
        index < wordsToShow ? el.classList.add("visible") : el.classList.remove("visible");
    });
}

// =========================================
// 7. LÓGICA RESPONSIVE PARA ANOTACIONES
// =========================================
function adjustAnnotationsScale() {
    // IMPORTANTE: Ahora medimos la imagen, no el contenedor
    const imgElement = document.getElementById("sequence-img");
    const annotationsLayer = document.getElementById("annotations-layer");

    if (!imgElement || !annotationsLayer) return;

    // 1. Debe coincidir EXACTAMENTE con el 'height' de tu CSS (783px)
    const referenceHeight = 783;

    // 2. Esperamos a que la imagen cargue para saber sus proporciones reales
    if (!imgElement.naturalWidth) {
        setTimeout(adjustAnnotationsScale, 50);
        return;
    }

    // 3. Obtenemos el tamaño de la "caja" de la imagen en la pantalla
    const rect = imgElement.getBoundingClientRect();
    const imgAspect = imgElement.naturalWidth / imgElement.naturalHeight;
    const containerAspect = rect.width / rect.height;

    let realDrawnHeight;

    // 4. Calculamos cuánto mide REALMENTE el iPod dibujado en pantalla
    if (containerAspect > imgAspect) {
        // La pantalla es ancha: el iPod choca arriba y abajo
        realDrawnHeight = rect.height;
    } else {
        // La pantalla es estrecha: el iPod se encoge y choca a los lados
        realDrawnHeight = rect.width / imgAspect;
    }

    // 5. Aplicamos la escala perfecta
    const scale = realDrawnHeight / referenceHeight;
    annotationsLayer.style.setProperty("--scale", scale);
}

// Escuchamos cuando se redimensiona la ventana
window.addEventListener("resize", adjustAnnotationsScale);
// Escuchamos cuando la imagen termina de cargar la primera vez
window.addEventListener("load", adjustAnnotationsScale);
// Ejecutamos por si acaso al inicio
adjustAnnotationsScale();
