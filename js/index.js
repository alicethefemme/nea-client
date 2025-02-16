/**
 * Document for use to create the logic for the index page.
 */

// Sets of the arrays for each graph, so that they can be modified in the interval.
let cpuLabels = ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
let cpuData = Array.from({length: 10}, () => Math.floor(Math.random() * 101));

let gpuLabels = ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
let gpuData = Array.from({length: 10}, () => Math.floor(Math.random() * 101));

let ramLabels = ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
let ramData = Array.from({length: 10}, () => Math.floor(Math.random() * 101));

let graphReloadTime = 15

// The graph objects so that they are created.
let cpuCreateGraph = new Chart(document.getElementById('overview-cpu'), {
    type: 'line',
    data: {
        labels: cpuLabels,
        datasets: [{
            label: 'CPU',
            data: cpuData // Create an array of 10 random numbers for now.
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

let gpuCreateGraph = new Chart(document.getElementById('overview-gpu'), {
    type: 'line',
    data: {
        labels: gpuLabels,
        datasets: [{
            label: 'GPU',
            data: gpuData
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

let ramCreateGraph = new Chart(document.getElementById('overview-ram'), {
    type: 'line',
    data: {
        labels: ramLabels,
        datasets: [{
            label: 'RAM',
            data: ramData
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

// Reload the graphs.
window.electron.invoke('get:data', 'settings').then((settings) => {
    graphReloadTime = settings.reloadTime
    let reloadGraphs = setInterval(reloadGraphHandler, getMilliseconds(graphReloadTime)); // Time out is in milliseconds.

    window.electron.settingsUpdate((settings) => {
        clearInterval(reloadGraphs);

        graphReloadTime = settings.reloadTime;

        reloadGraphs = setInterval(reloadGraphHandler, getMilliseconds(graphReloadTime));
    })
})

function reloadGraphHandler() {
    let num = Math.floor(Math.random() * 101);

    // Data could be added like this, however I chose to use variables, as this is easier to manage.
    // cpuCreateGraph.data.labels.push(`${num}`);
    // cpuCreateGraph.data.datasets[0].data.push(num);

    cpuLabels.push(num.toString())
    cpuData.push(num)
    cpuCreateGraph.update();

    // Delete the old data.
    cpuLabels.shift();
    cpuData.shift();

    cpuCreateGraph.update(); // Command used to update the graph, after affecting the data in it.
}

/**
 * A function to return the milliseconds from seconds.
 * @param time The seconds you want to transform
 * @returns {number} The milliseconds for the amount of seconds you requested.
 */
function getMilliseconds(time) {
    return time*1000
}
