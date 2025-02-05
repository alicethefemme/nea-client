/**
 * Use this file to run any logic for the webpage.
 */

let cpuData = []

let labels = ['30', '25', '20', '15', '10', '5', '0'];
let data = {data: [10, 20, 30, 20, 10, 20, 30]};
const cpuChart = window.generateGraph('overview-cpu', labels, )

// Run this every second.
setInterval(function() {
    document.getElementById("testtest").innerText = Date.now().toString();
}, getSeconds(1)) // Time out is in milliseconds.
