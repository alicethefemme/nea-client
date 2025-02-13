
let testParagraph = document.getElementById('test');

document.addEventListener('DOMContentLoaded', async () => {
    let settings = await window.electron.invoke('get:data', 'settings');

    console.log(settings);

    testParagraph.innerText = settings;
    // testParagraph.innerText = Object.keys(JSON.stringify(settings));
});

document.addEventListener('keyup', (key) => {
    if (key.key === 'Escape') {
        window.electron.send('close:settings');
    }
})