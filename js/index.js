/**
 * Document for use to create the logic for the index page.
 */

// Run this every second.
setInterval(function() {
    document.getElementById("testtest").innerText = Date.now().toString();
}, getMilliseconds(1)) // Time out is in milliseconds.

/**
 * A function to return the milliseconds from seconds.
 * @param time The seconds you want to transform
 * @returns {number} The milliseconds for the amount of seconds you requested.
 */
function getMilliseconds(time) {
    return time*1000
}
