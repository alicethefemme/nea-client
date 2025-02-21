
let reloadTimeInput = document.getElementById('reload-time-input');

window.electron.invoke('get:data', 'settings').then((settings) => {
    reloadTimeInput.value = settings.reloadTime
})

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

/**
 * RENDERING THE PAGE
 */

window.onload = () => {
    const sidebarButtons = document.getElementsByClassName('sidebar-button');

    for (let sidebarBttn of sidebarButtons) {
        sidebarBttn.onmouseover = function() {
            if(!sidebarBttn.className.includes('active')) {
                sidebarBttn.className = `${sidebarBttn.className} hover`
            }
        };
        sidebarBttn.onmouseout = function() {
            if(!sidebarBttn.className.includes('active')) {
                sidebarBttn.className = sidebarBttn.className.replace(' hover', '');
            }
        }
    }
}


