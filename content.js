let bubbleElement = null;
let targetSpeed = 1.0;
let isSliderActive = false;

// === 1. Speed Application Logic ===

function applySpeed() {
    chrome.storage.local.get(['videoSpeed'], (result) => {
        targetSpeed = result.videoSpeed || 1.0;
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (video.playbackRate !== targetSpeed) {
                // Note: Chrome will physically cap this at 16.0 behind the scenes
                video.playbackRate = targetSpeed;
            }
        });
        
        // Update bubble UI if it exists
        if (bubbleElement) {
            const textEl = bubbleElement.querySelector('.hs-text');
            const sliderEl = bubbleElement.querySelector('input[type=range]');
            if (textEl) textEl.innerText = targetSpeed.toFixed(1) + 'x';
            
            // Only update slider value programmatically if the user isn't currently dragging it
            if (sliderEl && document.activeElement !== sliderEl && !isSliderActive) {
                sliderEl.value = targetSpeed;
            }
        }
    });
}

// Observe dynamic video loads (like clicking a new video on YouTube)
const observer = new MutationObserver(applySpeed);
observer.observe(document.body, { childList: true, subtree: true });
applySpeed(); 


// === 2. Floating Bubble UI Logic ===

function initializeBubble() {
    chrome.storage.local.get(['bubbleEnabled', 'videoSpeed'], (result) => {
        targetSpeed = result.videoSpeed || 1.0;
        const isBubbleEnabled = result.bubbleEnabled !== false; 

        // Inject the Inter font into the host page
        if (!document.getElementById('hs-font-link')) {
            const fontLink = document.createElement('link');
            fontLink.id = 'hs-font-link';
            fontLink.rel = 'stylesheet';
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@800&display=swap';
            document.head.appendChild(fontLink);
        }

        if (isBubbleEnabled) {
            createBubble(targetSpeed);
        } else {
            removeBubble();
        }
    });
}

function createBubble(speed) {
    if (bubbleElement) return;

    bubbleElement = document.createElement('div');
    bubbleElement.className = 'hyperspeed-bubble-container';
    
    // Create the inner DOM structure
    bubbleElement.innerHTML = `
        <div class="hyperspeed-bubble-body">
            <span class="hs-text">${speed.toFixed(1)}x</span>
            <div class="hs-slider-wrapper">
                <input type="range" min="0.25" max="26" step="0.25" value="${speed}">
            </div>
        </div>
    `;

    document.body.appendChild(bubbleElement);

    // Fade in animation
    setTimeout(() => bubbleElement.classList.add('visible'), 10);

    const innerSlider = bubbleElement.querySelector('input[type=range]');
    const innerText = bubbleElement.querySelector('.hs-text');
    
    // --- Event Listeners for Slider & Hover ---

    // 1. Stop the slider from triggering the bubble's drag
    innerSlider.addEventListener('mousedown', (e) => {
        isSliderActive = true;
        e.stopPropagation(); 
    });

    // 2. Global unlock if they let go of the mouse
    document.addEventListener('mouseup', () => {
        if (isSliderActive) {
            isSliderActive = false;
            if (!bubbleElement.matches(':hover')) {
                bubbleElement.classList.remove('expanded');
            }
        }
    });

    // 3. Hover logic
    bubbleElement.addEventListener('mouseenter', () => {
        bubbleElement.classList.add('expanded');
    });

    bubbleElement.addEventListener('mouseleave', () => {
        if (!isSliderActive) {
            bubbleElement.classList.remove('expanded');
        }
    });

    // 4. Live slider updates
    innerSlider.addEventListener('input', (e) => {
        const newSpeed = parseFloat(e.target.value);
        innerText.innerText = newSpeed.toFixed(1) + 'x';
        
        const videos = document.querySelectorAll('video');
        videos.forEach(v => v.playbackRate = newSpeed);
        
        chrome.storage.local.set({ videoSpeed: newSpeed });
    });

    makeDraggableAndClickable(bubbleElement);
}

function removeBubble() {
    if (bubbleElement) {
        bubbleElement.classList.remove('visible');
        setTimeout(() => {
            if (bubbleElement && bubbleElement.parentNode) {
                bubbleElement.parentNode.removeChild(bubbleElement);
                bubbleElement = null;
            }
        }, 300);
    }
}


// === 3. Advanced Drag Logic ===

function makeDraggableAndClickable(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let isDragging = false;
    let startX, startY;

    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        if (e.target.tagName === 'INPUT') return;
        
        e.preventDefault(); 
        
        startX = e.clientX;
        startY = e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        isDragging = false;
        
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        
        if (Math.abs(e.clientX - startX) > 3 || Math.abs(e.clientY - startY) > 3) {
            isDragging = true;
        }

        if (isDragging) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            elmnt.style.bottom = "auto";
            elmnt.style.right = "auto";
        }
    }

    function closeDragElement(e) {
        document.onmouseup = null;
        document.onmousemove = null;

        if (!isDragging && !isSliderActive && e.target.tagName !== 'INPUT') {
            elmnt.classList.toggle('expanded');
        }
    }
}


// === 4. Storage Sync ===

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.videoSpeed) applySpeed();
    
    if (changes.bubbleEnabled) {
        if (changes.bubbleEnabled.newValue) initializeBubble();
        else removeBubble();
    }
});

initializeBubble();