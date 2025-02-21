
let reloadTimeInput = document.getElementById('reload-time-input');
let customLogPath = document.getElementById('custom-log-path-input');

let settings = {};

document.getElementById('custom-log-path-select-folder-button').addEventListener('click', () => {
    console.log('test');
})

/**
 * RENDERING THE PAGE
 */

window.onload = () => {
    window.electron.invoke('get:data', 'settings').then((settings) => {
        reloadTimeInput.value = settings.reloadTime;
        customLogPath.value = settings.customLogPath;

        /*
        SIDEBAR BUTTONS
         */
        const sidebarButtons = document.getElementsByClassName('sidebar-button');
        const sidebarButtonsContent = document.getElementsByClassName('content-section')

        // Get the active buttons and content setup on window load.
        let activeBttnId = 'sidebar-application-settings';
        document.getElementById('content-application-settings').style.display = 'block';


        for (let sidebarBttn of sidebarButtons) {
            sidebarBttn.onmouseover = function() {
                if(!sidebarBttn.classList.contains('active')) {
                    sidebarBttn.classList.add('hover');
                }
            };
            sidebarBttn.onmouseout = function() {
                if(!sidebarBttn.classList.contains('active')) {
                    sidebarBttn.classList.remove('hover');
                }
            };
            sidebarBttn.onclick = function() {
                if(!sidebarBttn.className.includes('active') && sidebarButtonsContent[sidebarBttn.id.replace('sidebar', 'content')]) {
                    sidebarBttn.classList.add('active');
                    if (sidebarBttn.classList.contains('hover')) {sidebarBttn.classList.remove('hover');}
                    document.getElementById(sidebarBttn.id.replace('sidebar', 'content')).style.display = 'block';

                    let prevActiveButton = document.getElementById(activeBttnId);
                    let prevActiveContent = document.getElementById(activeBttnId.replace('sidebar', 'content'));

                    prevActiveButton.className = prevActiveButton.className.replace(' active', '');
                    prevActiveContent.style.display = 'none';

                    activeBttnId = sidebarBttn.id;
                }
            }
        }

        /*
        FOOTER BUTTONS
         */

        document.getElementById('footer-cancel-button').onclick = function() {
            window.electron.send('close:settings');
        }
        document.getElementById('footer-save-button').onclick = function() {
            window.electron.store_data('settings', {
                reloadTime: reloadTimeInput.value,
                customLogPath: customLogPath.value,
            }).then((_) => {
                window.electron.send('close:settings');
            });
        }
    });
}


