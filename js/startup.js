// Get all the buttons and add their functions.
document.getElementById("addServer").onclick = function () {
    addServer()
};
document.getElementById("add-server-modal-back-button").onclick = function () {
    addServerBackButton()
}

document.getElementById("editServer").onclick = function () {
    editServer()
};
document.getElementById("edit-server-modal-back-button").onclick = function () {
    editServerBackButton()
}

document.getElementById("connectToServer").onclick = function () {
    connectServer()
};

const title = 'Server Commander';
const startupTitle = `${title} - Startup`;
const addServerTitle = `${title} - Add Server`;
const editServerTitle = `${title} - Edit Server`;

// Propagate the server list.
setupServers()

/**
 * Set up the server select list with all the data provided.
 */
function setupServers() {
    const serverSelect = document.getElementById("server")
    window.electron.invoke('get:data', 'accounts').then((accounts) => {
        console.log(accounts);
        for (let account of accounts.accounts) {
            let opt = document.createElement("option");
            opt.value = account.name;
            opt.innerHTML = account.name;
            serverSelect.appendChild(opt);
        }
    });
}


/**
 * Opens up the add server modal.
 */
function addServer() {
    document.getElementById("add-server-modal").style.display = "block"; // Show the modal
    document.title = addServerTitle; // Set the window title.
}

/**
 * Returns home from the add server modal.
 */
function addServerBackButton() {
    document.getElementById("add-server-modal").style.display = "none"; // Hide the modal
    document.getElementById("add-server-modal-form").reset(); // Reset the information in the form.
    document.title = startupTitle; // Restore the startup title.
}

/**
 * Gets the new server information and submits this.
 */
document.getElementById('add-server-modal-form').addEventListener('submit', (event) => {
    event.preventDefault();

    let serverName = document.getElementById('add-server-modal-server-name').value;
    let serverAddress = document.getElementById('add-server-modal-server-address').value;
    let serverUsername = document.getElementById('add-server-modal-server-username').value;
    let serverPassword = document.getElementById('add-server-modal-server-password').value;

    const serverRegex = new RegExp('\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}'); // Checks for a set of 1-3 numbers followed by a . 4 times.

    if (!serverRegex.test(serverAddress)) {
        alert('Please enter a valid server address. Comes in form: 0.0.0.0 where 0 is a number in range 0-255');
        for(let child of document.getElementById('add-server-modal-form').children) {
            if(child.tagName.toUpperCase() === 'INPUT') {
                console.log(child.attributes);
            }
        }
        return false;
    }



    // Make connection to server to test

    // Encrypt the password.
    window.electron.protect('password', serverPassword).then((password) => {
        password = btoa(password.toString()); // Set the password to a base 64 encoded version of the buffer.
        window.electron.store_data('account', {
            name: serverName,
            address: serverAddress,
            username: serverUsername,
            password: password
        }).then((_) => {
            setupServers();
            document.getElementById('add-server-modal').style.display = "none";
        }); // Redo the server setup once the accounts have been added back in.
    });
});

/*
Function to open up the "Edit Server" modal.
 */
function editServer() {
    const val = document.getElementById("server").value;
    if (val === "") {
        alert('Please select a valid server.');
    } else {
        document.getElementById("edit-server-modal").style.display = "block"; // Show the modal
        document.title = editServerTitle; // Set the window title.
    }
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
        window.electron.send('load:main'); // Send the message to the IPC to load the main window.
    }
}