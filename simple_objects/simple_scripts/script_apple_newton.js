document.addEventListener("DOMContentLoaded", () => {
    // 1. Capturamos los elementos clave
    const flipBtn = document.getElementById("flip-btn");
    const productImg = document.getElementById("product-img");
    const imgContainer = document.querySelector(".image-container");
    const lens = document.getElementById("magnifier-lens");

    // Si algún elemento falta, detenemos el script para evitar errores
    if (!flipBtn || !productImg) return;

    // 2. Control del estado Frontal/Trasero
    let isFrontView = true;

    // Rutas específicas para el Apple Newton (.png format) usando el ID '4'
    const frontImageSrc = "../images/simple_objects/4_apple_newton/front_4.png";
    const backImageSrc = "../images/simple_objects/4_apple_newton/back_4.png";

    // 3. Lógica del Botón FLIP
    flipBtn.addEventListener("click", () => {
        isFrontView = !isFrontView;

        // Efecto Fade Out suave
        productImg.style.opacity = 0;

        setTimeout(() => {
            // Cambiamos el origen de la imagen principal
            const newSrc = isFrontView ? frontImageSrc : backImageSrc;
            productImg.src = newSrc;

            // Fade In
            productImg.style.opacity = 1;

            // Sincronizar el zoom instantáneamente si el ratón sigue encima
            if (lens && lens.style.opacity == 1) {
                lens.style.backgroundImage = `url('${newSrc}')`;
            }
        }, 150);
    });

    // =========================================
    // 4. Lógica de la Lupa (Zoom)
    // =========================================
    function moveMagnifier(e) {
        if (!lens) return;

        const imgRect = productImg.getBoundingClientRect();
        const containerRect = imgContainer.getBoundingClientRect();

        let imgX = e.clientX - imgRect.left;
        let imgY = e.clientY - imgRect.top;

        let containerX = e.clientX - containerRect.left;
        let containerY = e.clientY - containerRect.top;

        // Ocultar si el cursor sale de los límites de la imagen
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
        if (!lens) return;
        const currentSrc = isFrontView ? frontImageSrc : backImageSrc;
        lens.style.backgroundImage = `url('${currentSrc}')`;
    });

    imgContainer.addEventListener("mouseleave", () => {
        if (lens) lens.style.opacity = 0;
    });

    imgContainer.addEventListener("mousemove", moveMagnifier);
});
