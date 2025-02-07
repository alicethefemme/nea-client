/**
 * Document for use to create the logic for the index page.
 */

let cpuGraph = document.getElementById('overview-cpu');
let gpuGraph = document.getElementById('overview-gpu');
let ramGraph = document.getElementById('overview-ram');

let cpuCreateGraph = new Chart(cpuGraph, {
    type: 'line',
    data: {
        labels: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
        datasets: [{
            label: 'CPU',
            data: Array.from({length: 10}, () => Math.floor(Math.random() * 101)) // Create an array of 10 random numbers for now.
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {

            },
            y: {
                beginAtZero: true
            }
        }
    }
});

let gpuCreateGraph = new Chart(gpuGraph, {
    type: 'line',
    data: {
        labels: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
        datasets: [{
            label: 'GPU',
            data: Array.from({length: 10}, () => Math.floor(Math.random() * 101)) // Create an array of 10 random numbers for now.
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {

            },
            y: {
                beginAtZero: true
            }
        }
    }
});

let ramCreateGraph = new Chart(ramGraph, {
    type: 'line',
    data: {
        labels: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
        datasets: [{
            label: 'RAM',
            data: Array.from({length: 10}, () => Math.floor(Math.random() * 101)) // Create an array of 10 random numbers for now.
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {

            },
            y: {
                beginAtZero: true
            }
        }
    }
});
// Reload the graphs every 15 seconds.
setInterval(function() {

    let num = Math.floor(Math.random() * 101);

    cpuCreateGraph.data.labels.push(`${num}`);
    cpuCreateGraph.data.datasets[0].data.push(num);
    cpuCreateGraph.update();

    // Delete the old data.
    cpuCreateGraph.data.labels.shift();
    cpuCreateGraph.data.datasets[0].data.shift();

    cpuCreateGraph.update(); // Command used to update the graph, after affecting the data in it.

}, getMilliseconds(1)) // Time out is in milliseconds.

/**
 * A function to return the milliseconds from seconds.
 * @param time The seconds you want to transform
 * @returns {number} The milliseconds for the amount of seconds you requested.
 */
function getMilliseconds(time) {
    return time*1000
}
