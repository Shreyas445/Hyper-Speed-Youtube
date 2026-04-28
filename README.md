# HyperSpeed Youtube Video upto 16x 🚀

A next-level Manifest V3 Chrome extension that shatters the standard 2x playback limit, allowing you to force HTML5 video speeds up to 26x across the web. Features a custom, liquid-glass floating UI that works globally, even on embedded iframes.

## ✨ Features

- **Break the Limit:** Push video playback up to 26x (Note: Chromium engines internally hard-cap media playback at 16x, but the UI goes all the way).
- **Global Injection:** Works seamlessly on YouTube, embedded iframes, and standard `<video>` tags across any website.
- **Next-Level UI/UX:** A buttery-smooth, draggable floating liquid bubble that expands into a sleek control pill on hover.
- **Persistent State:** Saves your preferred speed and UI preferences instantly using `chrome.storage.local`.
- **Smart Event Handling:** Advanced drag-and-drop logic that perfectly isolates range slider adjustments from bubble movement without event collisions.

## 🛠️ Tech Stack

- **Architecture:** Chrome Extension Manifest V3
- **Logic:** Vanilla JavaScript (`content.js`, `popup.js`)
- **Styling:** CSS3 (Glassmorphism, CSS Animations, Custom Range Sliders)
- **State Management:** Chrome Storage API

## 📦 Installation (Developer Mode)

Since this extension is a custom build, you can load it manually directly into your browser:

1. Clone this repository or download the source code zip.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **"Developer mode"** by toggling the switch in the top right corner.
4. Click the **"Load unpacked"** button in the top left.
5. Select the folder containing the extension files (the folder with `manifest.json`).
6. The HyperSpeed icon should now appear in your browser toolbar!

## 💻 Usage

1. Pin the extension to your Chrome toolbar for easy access.
2. Click the extension icon to open the main control panel.
3. Use the global slider to set your speed, or use the **"Reset to 1.0x"** button.
4. Toggle the **Floating Bubble** on or off.
5. On any page with a video, hover over the floating liquid bubble in the bottom right corner to instantly adjust the speed without opening the popup. You can also click and drag the bubble anywhere on your screen.

## ⚠️ Known Browser Constraints

* **Audio Muting:** Chromium-based browsers automatically mute audio when `playbackRate` exceeds `4.0x`. 
* **Speed Cap:** While the extension UI supports up to 26x, the Chrome engine physically limits media playback processing to a maximum of `16.0x`.

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
