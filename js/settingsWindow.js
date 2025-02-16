
let testParagraph = document.getElementById('test');

document.addEventListener('DOMContentLoaded', () => {
    window.electron.invoke('get:data', 'settings').then((settings) => {
        testParagraph.innerText = settings.reloadTime // Ensure that you get settings with their given string title.
    })
    // console.log(JSON.parse(settings));

});

document.addEventListener('keyup', (key) => {
    if (key.key === 'Escape') {
        window.electron.send('close:settings');
    }
})