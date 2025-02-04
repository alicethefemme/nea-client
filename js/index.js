
document.addEventListener('DOMContentLoaded', function() {
    const title = 'Server Commander';
    const mainTitle = `${title} - Main`;

    const overview = `${title} - Overview`;

    let active = 'sidebar-overview-button';

    document.title = mainTitle;

    // Apply a mouseover and mouseout function to all the items in the sidebar, so that they highlight.
    for(let child of document.getElementById('sidebar').children) {
        if (child.id.endsWith('settings-button')) {continue;}
        child.onmouseover = function() {
            if (child.className !== 'sidebar-button active') {
                child.setAttribute('class', 'sidebar-button hover');
            }
        };
        child.onmouseout = function() {
            if (child.className !== 'sidebar-button active') {
                child.setAttribute('class', 'sidebar-button')
            }
        };
        child.onclick = function() {
            // Remove the active from the button.
            document.getElementById(active).setAttribute('class', 'sidebar-button');
            document.getElementById(sidebarReplace(active)).style.display = 'none';

            // Add the active to the new button.
            child.setAttribute('class', 'sidebar-button active');
            active = child.id;

            // Set the content to display.
            document.getElementById(sidebarReplace(active)).style.display = 'block';
        }
    }
})
/*
Automatically remove parts of the name to find the child window
@param {String} name The name of the sidebar button
@return {String} The name without the sidebar button text
 */
function sidebarReplace(name) {
    return name.replace('sidebar-', '').replace('-button', '')
}