/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 *
 * Document for UI elements
 */

window.onload = () => {
    const title = 'Server Commander';
    const overviewTitle = `${title} - Overview`;
    const systemInformationTitle = `${title} - System Information`
    const networkInformationTitle = `${title} - Network Information`
    const dockerTitle = `${title} - Docker`

    const titles = new Map();
    titles.set('overview', overviewTitle);
    titles.set('system-information', systemInformationTitle);
    titles.set('network-information', networkInformationTitle);
    titles.set('docker', dockerTitle);

    let active = 'sidebar-overview-button';
    document.title = titles.get(sidebarReplace(active));

// Apply a mouseover and mouseout function to all the items in the sidebar, so that they highlight. Change title on active.
    for (let child of document.getElementById('sidebar').children) { // For all the children in the sidebar.
        child.onmouseover = function () {
            if (!child.className.includes('active')) { // If there is not an active class applied.
                child.setAttribute('class', `${child.className} hover`); // Add the hover effect.
            }
        };
        child.onmouseout = function () {
            if (!child.className.includes('active')) { // If there is not an active class applied
                child.setAttribute('class', child.className.replace('hover', '')) // Remove the hover class
            }
        };
        child.onclick = function () {

            // Remove the active from the button.
            let prevActive = document.getElementById(active)
            prevActive.setAttribute('class', prevActive.className
                .replace('active', '')
                .replace('hover', '')); // Get rid of the active and the hover classes.
            if (sidebarReplace(prevActive.id) !== 'settings') { // If the button isn't settings
                document.getElementById(sidebarReplace(prevActive.id)).style.display = 'none'; // Hide its menu
            }

            // Add the active to the new button.
            child.setAttribute('class', `${child.className} active`);
            active = child.id;

            // Update main display
            if (sidebarReplace(active) !== "settings") {
                document.getElementById(sidebarReplace(active)).style.display = 'block'; // Show the menu.
                document.title = titles.get(sidebarReplace(active)); // Set the new title.
            }
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