const slider = document.getElementById('speedSlider');
const display = document.getElementById('speedDisplay');
const bubbleToggle = document.getElementById('bubbleToggle');
const resetBtn = document.getElementById('resetBtn'); // Get the button

// Load saved settings on open
chrome.storage.local.get(['videoSpeed', 'bubbleEnabled'], (result) => {
  const savedSpeed = result.videoSpeed || 1.0;
  const isBubbleEnabled = result.bubbleEnabled !== false;

  slider.value = savedSpeed;
  display.innerText = savedSpeed.toFixed(2);
  bubbleToggle.checked = isBubbleEnabled;
});

// Update speed from slider
slider.addEventListener('input', (e) => {
  const newSpeed = parseFloat(e.target.value);
  display.innerText = newSpeed.toFixed(2);
  chrome.storage.local.set({ videoSpeed: newSpeed });
});

// === NEW: Reset Logic ===
resetBtn.addEventListener('click', () => {
    const defaultSpeed = 1.0;
    slider.value = defaultSpeed;
    display.innerText = defaultSpeed.toFixed(2);
    // Setting this triggers the chrome.storage.onChanged listener in content.js
    chrome.storage.local.set({ videoSpeed: defaultSpeed }); 
});

// Update Bubble State
bubbleToggle.addEventListener('change', (e) => {
  const isEnabled = e.target.checked;
  chrome.storage.local.set({ bubbleEnabled: isEnabled });
});