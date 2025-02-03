
document.addEventListener('DOMContentLoaded', function() {
    const title = 'Server Commander';
    const mainTitle = `${title} - Main`;

    const overview = `${title} - Overview`

    document.title = mainTitle;

    document.getElementById("sidebar-overview-button").onclick = function() {
        //document.getElementById("sidebar-overview-button").setAttribute('class', 'active'); // Use this piece of code to set the class to active, rendering it the current item.
    }

    // TODO: Fix code here.
    // // Automatically set the hover for any hovered over button
    // document.onmouseover = function(ev) { // On any mouse over event.
    //     let element = ev.target;
    //     if (element.parent.id === "sidebar") { // If the element has a parent of the sidebar.
    //         element.setAttribute('class', 'hover'); // Sets the hover colour
    //     }
    // }
    // // Automatically clear the hover for any button
    // document.onmouseout = function(ev) { // On any mouse out event.
    //     let element = ev.target;
    //     if(element.parent.id === "sidebar") { // If the element has a parent of the sidebar.
    //         element.removeAttribute('class'); // Removes the class of active.
    //     }
    // }
})