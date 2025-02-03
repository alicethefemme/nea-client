
document.addEventListener('DOMContentLoaded', function() { // Wait for the document to be loaded. Has to be used as the script is referenced in the head of the file.

    // Get all the buttons and add their functions.
    document.getElementById("addServer").onclick = function () {addServer()};
    document.getElementById("add-server-modal-back-button").onclick = function() {addServerBackButton()}

    document.getElementById("editServer").onclick = function () {editServer()};
    document.getElementById("edit-server-modal-back-button").onclick = function() {editServerBackButton()}

    document.getElementById("connectToServer").onclick = function () {connectServer()};

    const title = 'Server Commander';
    const startupTitle = `${title} - Startup`;
    const addServerTitle = `${title} - Add Server`;
    const editServerTitle = `${title} - Edit Server`;

    // Get the select box, and add 10 servers to it.
    const serverSelect = document.getElementById("server")
    for (let i = 0; i < 10; i++) {
        let opt = document.createElement("option"); // Create a new option element.
        opt.value = (i + 1).toString(); // Set the value to the string of the number + 1.
        opt.innerHTML = "Server " + (i + 1); // Set the visible text inside the HTML brackets.
        serverSelect.appendChild(opt) // Add the new option to the select menu.
    }

    /*
    Function to open up the "Add Server" modal.
     */
    function addServer() {
        document.getElementById("add-server-modal").style.display = "block"; // Show the modal
        document.title = addServerTitle; // Set the window title.
    }

    /*
    Function to return to home from the "Add Server" modal.
     */
    function addServerBackButton() {
        document.getElementById("add-server-modal").style.display = "none"; // Hide the modal
        document.getElementById("edit-server-modal-form").reset(); // Reset the information in the form.
        document.title = startupTitle; // Restore the startup title.
    }

    /*
    Function to open up the "Edit Server" modal.
     */
    function editServer() {
        document.getElementById("edit-server-modal").style.display = "block"; // Show the modal
        document.title = editServerTitle; // Set the window title.
    }

    /*
    Function to return to home from the "Edit Server" modal.
     */
    function editServerBackButton() {
        document.getElementById("edit-server-modal").style.display = "none"; // Hide the modal
        document.getElementById("edit-server-modal-form").reset(); // Reset the information in the form.
        document.title = startupTitle; // Restore the startup title.
    }

    function connectServer() {
        const val = document.getElementById("server").value; // Get the dropdown box.

        // Check that the value of the item is valid
        if (val === "") { // If the value hasn't been set.
            alert("Please select a valid server!");
        } else {
            window.electron.send('load-main'); // Send the message to the IPC to load the main window.
        }
    }
})