
let testParagraph = document.getElementById('test');

document.addEventListener('DOMContentLoaded', async () => {
    let settings = await window.electron.invoke('get-data', 'settings');

    testParagraph.innerText = settings;
    // testParagraph.innerText = Object.keys(JSON.stringify(settings));
});

document.addEventListener('keyup', (key) => {
    try {
        window.electron.send('close-settings');

    } catch (e) {
        console.error(e);
    }
})