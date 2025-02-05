
// Document to be used for the main logic of the index file.

document.addEventListener('DOMContentLoaded', function () {
    const title = 'Server Commander';
    const mainTitle = `${title} - Main`;

    const overview = `${title} - Overview`;

    let active = 'sidebar-overview-button';

    document.title = mainTitle;

    // Apply a mouseover and mouseout function to all the items in the sidebar, so that they highlight.
    for (let child of document.getElementById('sidebar').children) {
        // if (child.id.endsWith('settings-button')) { // Don't change the classes for the settings button.
        //     continue;
        // }
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
})


/**
    Automatically remove parts of the name to find the child window
    @param {String} name The name of the sidebar button
    @return {String} The name without the sidebar button text
 */
function sidebarReplace(name) {
    return name.replace('sidebar-', '').replace('-button', '')
}