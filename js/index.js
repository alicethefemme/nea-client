
document.addEventListener('DOMContentLoaded', function() {
    const title = 'Server Commander';
    const mainTitle = `${title} - Main`;

    const overview = `${title} - Overview`

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
    }
})