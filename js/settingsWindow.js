
let reloadTimeInput = document.getElementById('reload-time-input');

document.addEventListener('DOMContentLoaded', () => {
    window.electron.invoke('get:data', 'settings').then((settings) => {
        reloadTimeInput.value = settings.reloadTime
    })
    // console.log(JSON.parse(settings));

});

/**
 * EVENT LISTENERS
 */
document.addEventListener('keyup', (key) => {
    if (key.key === 'Escape') {
        window.electron.send('close:settings');
    }
});
document.getElementById('custom-log-path-select-folder-button').addEventListener('click', () => {
    console.log('test');
})