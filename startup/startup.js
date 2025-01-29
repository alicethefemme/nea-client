document.addEventListener('DOMContentLoaded', function(event) {

    // Get all the buttons and add their functions.
    document.getElementById("addServer").onclick = function () {addServer()};
    document.getElementById("editServer").onclick = function () {editServer()};
    document.getElementById("connectToServer").onclick = function () {connectServer()};

    // Get the select box, and add 10 servers to it.
    const serverSelect = document.getElementById("server")
    for (let i = 0; i < 10; i++) {
        let opt = document.createElement("option"); // Create a new option element.
        opt.value = (i + 1).toString(); // Set the value to the string of the number + 1.
        opt.innerHTML = "Server " + (i + 1); // Set the visible text inside the HTML brackets.
        serverSelect.appendChild(opt) // Add the new option to the select menu.
    }


    function addServer() {
        document.getElementById("add-server-modal").style.display = "block";
    }

    function editServer() {
        alert("You have edited a server!");
    }

    function connectServer() {
        const val = document.getElementById("server").value;

        // Check that the value of the item is valid
        if (val === "") {
            alert("Please select a valid server!");
        } else {
            alert(`You have connected to Server ${val}!`); // Use backticks to do string formatting here.
        }
    }
})