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

    const titles = {
        'overview': overviewTitle,
        'system-information': systemInformationTitle,
        'network-information': networkInformationTitle,
        'docker': dockerTitle
    }

    let active = 'sidebar-overview-button';
    document.title = titles[sidebarReplace(active)];

    const sidebarButtons = {
        'sidebar-overview-button': null,
        'sidebar-system-information-button': 'sidebar-system-information-submenu',
        'sidebar-network-information-button': 'sidebar-network-information-submenu',
        'sidebar-docker-button': 'sidebar-docker-submenu'
    };
    const extendedSidebarButtons = {...sidebarButtons, 'sidebar-settings-button': null};

    // Apply a mouseover and mouseout function to all the items in the sidebar, so that they highlight. Change title on active.
    for (let child of document.getElementById('sidebar').children) { // For all the children in the sidebar.
        child.onmouseover = function () {
            if (!child.className.includes('active') && Object.keys(extendedSidebarButtons).includes(child.id)) { // If there is not an active class applied, and it belongs to the submenu buttons
                child.className = `${child.className} hover`; // Add hover to the classes.
            }
        };
        child.onmouseout = function () {
            if (!child.className.includes('active') && Object.keys(extendedSidebarButtons).includes(child.id)) { // If there is not an active class applied, and it belongs to the submenu buttons
                child.setAttribute('class', child.className.replace(' hover', '')) // Remove the hover class
            }
        };
        child.onclick = function () {
            if (child.id === 'sidebar-settings-button') { // Load the settings window on button press.
                window.electron.send('load-settings');
            }
            if (Object.keys(sidebarButtons).includes(child.id)) { // Check that it belongs to the submenu buttons.

                // Remove the active from the button.
                let prevActive = document.getElementById(active);
                prevActive.className = prevActive.className.replace(' active', '').replace(' hover', ''); // Remove the hover and active classes.
                document.getElementById(sidebarReplace(prevActive.id)).style.display = 'none'; // Hide the content connected to it.

                // Get the submenu buttons for the previously active selection and hide them.
                if (sidebarButtons[prevActive.id] !== null) {
                    document.getElementById(sidebarButtons[prevActive.id]).style.display = 'none';
                }

                // Add the active to the new button.
                child.className = `${child.className} active`;
                active = child.id;

                // Show the new submenu buttons.
                if (sidebarButtons[active] !== null) {
                    document.getElementById(sidebarButtons[active]).style.display = 'block';
                }
                // Update main display
                document.title = titles[sidebarReplace(active)]; // Set the new title.
                document.getElementById(sidebarReplace(active)).style.display = 'block'; // Show the main content
            }
        }
    }

    // Apply a mouseover, mouseout and click function to all the items in the sidebar submenus
    for (let submenuContainer of document.getElementsByClassName('sidebar-sub-button')) {
        for (let child of submenuContainer.children) {
            child.onmouseover = function () {
                child.className = `${child.className} hover`
            };
            child.onmouseout = function () {
                child.className = child.className.replace(' hover', '')
            };
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