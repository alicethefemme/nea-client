/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

// Document to be used for the UI elements.

// Get a mouse over and out script.

// Run this every second.
setInterval(function() {
    document.getElementById("testtest").innerText = Date.now().toString();
}, getSeconds(1)) // Time out is in milliseconds.

/**
    Function to get seconds from milliseconds (* 1000)
    @param time The time in seconds you want
    @return The time converted to milliseconds.
 */
function getSeconds(time) {
    return time * 1000
}