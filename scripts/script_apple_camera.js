// QuickTake 100 execution script
const totalFrames = 26; // Total number of images for the Apple Camera
const imgElement = document.getElementById("sequence-img");
const imgContainer = document.querySelector(".image-container");
const lens = document.getElementById("magnifier-lens");

const infoBtn = document.getElementById("info-toggle-btn");
const annotationsLayer = document.getElementById("annotations-layer"); 

// UI Containers for the specific camera frames
const frame7Annotations = document.querySelector(".frame-7-annotations");
const frame10Annotations = document.querySelector(".frame-10-annotations");
const frame14Annotations = document.querySelector(".frame-14-annotations");
const frame20Annotations = document.querySelector(".frame-20-annotations");
const frame26Annotations = document.querySelector(".frame-26-annotations");

let currentFrameIndex = 1;
let isInfoActive = false;

// 1. Image Preloading (Updated to .png)
const images = [];
for (let i = 1; i <= totalFrames; i++) {
    const img = new Image();
    img.src = `images/apple_camera/${i}.png`; // Changed to .png
    images.push(img);
}

// 2. Annotations Button Logic
const bgText = document.getElementById("background-text");

infoBtn.addEventListener("click", () => {
    isInfoActive = !isInfoActive;
    infoBtn.classList.toggle("active");

    // Toggle blur effect ONLY on the background text
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
    // 1. Hide the main layer and ALL specific views by default
    annotationsLayer.classList.remove("show");
    if (frame7Annotations) frame7Annotations.style.display = "none";
    if (frame10Annotations) frame10Annotations.style.display = "none";
    if (frame14Annotations) frame14Annotations.style.display = "none";
    if (frame20Annotations) frame20Annotations.style.display = "none";
    if (frame26Annotations) frame26Annotations.style.display = "none";

    // Exit function if the "i" button is turned off
    if (!isInfoActive) return;

    // 2. Check the EXACT frame index to display the corresponding layer
    if (currentFrameIndex === 7) {
        // Back View
        annotationsLayer.classList.add("show");
        if (frame7Annotations) frame7Annotations.style.display = "block";
    } else if (currentFrameIndex === 10) {
        // Side View
        annotationsLayer.classList.add("show");
        if (frame10Annotations) frame10Annotations.style.display = "block";
    } else if (currentFrameIndex === 14) {
        // Front View
        annotationsLayer.classList.add("show");
        if (frame14Annotations) frame14Annotations.style.display = "block";
    } else if (currentFrameIndex === 20) {
        // Top View
        annotationsLayer.classList.add("show");
        if (frame20Annotations) frame20Annotations.style.display = "block";
    } else if (currentFrameIndex === 26) {
        // Front View (Frame 26 is identical to Frame 14)
        annotationsLayer.classList.add("show");
        if (frame26Annotations) frame26Annotations.style.display = "block";
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
        // Updated to load PNGs
        const newSrc = `images/apple_camera/${frameIndex}.png`;

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
    // Updated to load PNGs in the magnifier
    lens.style.backgroundImage = `url('images/apple_camera/${currentFrameIndex}.png')`;
    lens.style.opacity = 1;
});
imgContainer.addEventListener("mouseleave", () => (lens.style.opacity = 0));
imgContainer.addEventListener("mousemove", moveMagnifier);

// 5. Video Button Logic
const videoBtn = document.querySelector(".btn-video");
const videoOverlay = document.getElementById("video-overlay");
const videoPlayer = document.getElementById("main-video"); 
let isVideoActive = false;

// Save base URL to reset playback upon closing
const iframeSrc = videoPlayer.src;

videoBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    isVideoActive = !isVideoActive;
    videoBtn.classList.toggle("active");

    if (isVideoActive) {
        // OPEN video
        videoOverlay.classList.add("show");
        videoBtn.innerHTML = "&#10006;";

        // Append autoplay if not present
        if (!videoPlayer.src.includes("autoplay=1")) {
            videoPlayer.src = iframeSrc + (iframeSrc.includes("?") ? "&" : "?") + "autoplay=1";
        }
    } else {
        // CLOSE video
        videoOverlay.classList.remove("show");
        videoBtn.innerHTML = "&#9658;";

        // Reset src to force YouTube to stop playback
        videoPlayer.src = iframeSrc;
    }
});

videoOverlay.addEventListener("click", (e) => {
    if (e.target === videoOverlay) videoBtn.click();
});

// 6. Progressive Keywords Logic (Customized for QuickTake 100)
const keywordsData = [
    "QuickTake 100",
    "Digital Pioneer",
    "VGA Resolution",
    "1MB Flash EPROM",
    "Binocular Design",
    "Macintosh Serial",
    "Fixed Focus Lens",
    "Status LCD",
    "Built-in Flash",
    "PICT Format",
    "Apple & Kodak",
    "Chunky Plastic",
    "Retro Tech",
    "AA Batteries",
    "1994 Release",
    "8-pin mini-DIN",
    "Consumer Digital",
    "History"
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
// 7. RESPONSIVE ANNOTATIONS LOGIC
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