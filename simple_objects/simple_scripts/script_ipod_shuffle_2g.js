/* Professor: English Comments for understanding Legacy Script Logic */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Target Key UI Elements
    const flipBtn = document.getElementById("flip-btn");
    const productImg = document.getElementById("product-img");
    const imgContainer = document.querySelector(".image-container");
    const lens = document.getElementById("magnifier-lens");

    // Exit script immediately if essential elements are missing (prevents console errors)
    if (!flipBtn || !productImg) return;

    // 2. Manage View State (Front/Back)
    let isFrontView = true;

    /* Updated Image paths specifically for iPod Shuffle 2nd Gen (.png format) 
       using ID '8' convention 
    */
    const frontImageSrc = "../images/simple_objects/8_ipod_shuffle_2g/front_8.png";
    const backImageSrc = "../images/simple_objects/8_ipod_shuffle_2g/back_8.png";

    // 3. FLIP Button Interaction Logic
    flipBtn.addEventListener("click", () => {
        // Toggle view state
        isFrontView = !isFrontView;
        
        // Execute smooth fade out transition
        productImg.style.opacity = 0;

        setTimeout(() => {
            // Update main image source during fade out
            const newSrc = isFrontView ? frontImageSrc : backImageSrc;
            productImg.src = newSrc;
            
            // Execute fade in transition
            productImg.style.opacity = 1;
            
            /* If user is currently hovering over image while clicking flip, 
               instantaneously update the magnifier background to avoid 'ghost' effect
            */
            if (lens && lens.style.opacity == 1) {
                lens.style.backgroundImage = `url('${newSrc}')`;
            }
        }, 150); // Matches CSS transition timing (0.3s total, executing halfway)
    });

    // =========================================
    // 4. Magnifier Lens (Zoom) Interaction Logic
    // =========================================
    function moveMagnifier(e) {
        if (!lens) return;
        
        // Calculate the actual boundaries of the responsive product image
        const imgRect = productImg.getBoundingClientRect();
        const containerRect = imgContainer.getBoundingClientRect();

        let imgX = e.clientX - imgRect.left;
        let imgY = e.clientY - imgRect.top;

        let containerX = e.clientX - containerRect.left;
        let containerY = e.clientY - containerRect.top;

        /* Hide magnifier immediately if cursor exits the exact bounds of the 
           responsive image area (prevents zoom on empty background) 
        */
        if (imgX < 0 || imgX > imgRect.width || imgY < 0 || imgY > imgRect.height) {
            lens.style.opacity = 0;
            return;
        } else {
            // Ensure visibility if within bounds
            lens.style.opacity = 1;
        }

        // Positioning logic for the magnifier lens box (centered on cursor)
        lens.style.left = containerX - lens.offsetWidth / 2 + "px";
        lens.style.top = containerY - lens.offsetHeight / 2 + "px";

        // Positioning logic for the zoomed image background inside the lens
        let percX = (imgX / imgRect.width) * 100;
        let percY = (imgY / imgRect.height) * 100;
        lens.style.backgroundPosition = `${percX}% ${percY}%`;
    }

    // Interaction Activators
    imgContainer.addEventListener("mouseenter", () => {
        if (!lens) return;
        // Dynamically set magnifier background source based on current view state
        const currentSrc = isFrontView ? frontImageSrc : backImageSrc;
        lens.style.backgroundImage = `url('${currentSrc}')`;
        // Visibility is handled by mousemove detection for precise bounding
    });
    
    imgContainer.addEventListener("mouseleave", () => {
        if (lens) lens.style.opacity = 0;
    });
    
    // Core logic runs on precise mouse movement within container
    imgContainer.addEventListener("mousemove", moveMagnifier);
});