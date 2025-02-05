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


// Apply a mouseover and mouseout function to all the items in the sidebar, so that they highlight. Change title on active.
for (let child of document.getElementById('sidebar').children) {
    child.onmouseover = function () {
        if (child.className !== 'sidebar-button active') {
            child.setAttribute('class', `${child.className} hover`);
        }
    };
    child.onmouseout = function () {
        if (child.className !== 'sidebar-button active') {
            child.setAttribute('class', child.className.replace('hover', ''))
        }
    };
    child.onclick = function () {
        // Remove the active from the button.
        let prevActive = document.getElementById(active)
        prevActive.setAttribute('class', prevActive.className.replace('active', ''));
        if(sidebarReplace(prevActive.id) !== 'settings') {
            document.getElementById(sidebarReplace(active)).style.display = 'none';
        }

        // Add the active to the new button.
        child.setAttribute('class', `${child.className} active`);
        active = child.id;

        // Update main display
        if(sidebarReplace(active) !== "settings") {
            // Set the content to display.
            document.getElementById(sidebarReplace(active)).style.display = 'block';
        }

    }
}



/**
 Automatically remove parts of the name to find the child window
 @param {String} name The name of the sidebar button
 @return {String} The name without the sidebar button text
 */
function sidebarReplace(name) {
    return name.replace('sidebar-', '').replace('-button', '')
}

/**
    Function to get seconds from milliseconds (* 1000)
    @param time The time in seconds you want
    @return The time converted to milliseconds.
 */
function getSeconds(time) {
    return time * 1000
}