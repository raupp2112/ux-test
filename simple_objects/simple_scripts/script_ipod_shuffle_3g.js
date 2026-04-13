/* Professor: English Comments for UI Component Logic */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Target Key UI Elements from the DOM
    const flipBtn = document.getElementById("flip-btn");
    const productImg = document.getElementById("product-img");
    const imgContainer = document.querySelector(".image-container");
    const lens = document.getElementById("magnifier-lens");

    // Exit script immediately if essential elements are missing (prevents console errors)
    if (!flipBtn || !productImg) return;

    // 2. Manage View State (Front/Back)
    let isFrontView = true;

    /* Updated Image paths specifically for iPod shuffle 3rd Gen (.png format) 
       using ID '14' convention to maintain repository structure 
    */
    const frontImageSrc = "../images/simple_objects/14_ipod_shuffle_3g/front_14.png";
    const backImageSrc = "../images/simple_objects/14_ipod_shuffle_3g/back_14.png";

    // 3. FLIP Button Interaction Logic
    flipBtn.addEventListener("click", () => {
        // Toggle the boolean state
        isFrontView = !isFrontView;
        
        // Execute smooth fade out transition for visual elegance
        productImg.style.opacity = 0;

        setTimeout(() => {
            // Update main image source during the invisible phase of the fade
            const newSrc = isFrontView ? frontImageSrc : backImageSrc;
            productImg.src = newSrc;
            
            // Execute fade in transition
            productImg.style.opacity = 1;
            
            /* Edge case handling: If the user is currently hovering over the image 
               while clicking flip, instantaneously update the magnifier background 
               to avoid a 'ghosting' discrepancy between the main image and lens.
            */
            if (lens && lens.style.opacity == 1) {
                lens.style.backgroundImage = `url('${newSrc}')`;
            }
        }, 150); // Matches CSS transition timing (0.3s total, updating exactly halfway)
    });

    // =========================================
    // 4. Magnifier Lens (Zoom) Interaction Logic
    // =========================================
    function moveMagnifier(e) {
        if (!lens) return;
        
        // Calculate the actual boundaries of the responsive product image container
        const imgRect = productImg.getBoundingClientRect();
        const containerRect = imgContainer.getBoundingClientRect();

        // Calculate cursor coordinates relative to the image itself
        let imgX = e.clientX - imgRect.left;
        let imgY = e.clientY - imgRect.top;

        // Calculate cursor coordinates relative to the parent container
        let containerX = e.clientX - containerRect.left;
        let containerY = e.clientY - containerRect.top;

        /* Hide magnifier lens immediately if cursor exits the exact bounds of the 
           responsive image area (prevents awkward zooming on blank background) 
        */
        if (imgX < 0 || imgX > imgRect.width || imgY < 0 || imgY > imgRect.height) {
            lens.style.opacity = 0;
            return;
        } else {
            // Ensure visibility if cursor remains within image bounds
            lens.style.opacity = 1;
        }

        // Positioning logic for the magnifier lens box (keeps it centered on cursor)
        lens.style.left = containerX - lens.offsetWidth / 2 + "px";
        lens.style.top = containerY - lens.offsetHeight / 2 + "px";

        // Positioning logic for the zoomed background image inside the lens
        let percX = (imgX / imgRect.width) * 100;
        let percY = (imgY / imgRect.height) * 100;
        lens.style.backgroundPosition = `${percX}% ${percY}%`;
    }

    // Interaction Listeners Setup
    imgContainer.addEventListener("mouseenter", () => {
        if (!lens) return;
        // Dynamically set magnifier background source based on the current flip state
        const currentSrc = isFrontView ? frontImageSrc : backImageSrc;
        lens.style.backgroundImage = `url('${currentSrc}')`;
        // Initial visibility handled by mousemove detection
    });
    
    imgContainer.addEventListener("mouseleave", () => {
        if (lens) lens.style.opacity = 0;
    });
    
    // Core lens positioning logic executes on continuous mouse movement
    imgContainer.addEventListener("mousemove", moveMagnifier);
});