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

const serverRegex = new RegExp('\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}'); // Checks for a set of 1-3 numbers followed by a . 4 times.

// Propagate the server list.
setupServers()

/**
 * Set up the server select list with all the data provided.
 */
function setupServers() {
    const serverSelect = document.getElementById("server")
    window.electron.invoke('get:data', 'accounts').then((accounts) => {
        for (let child of serverSelect.children) {
            if(child.value !== '') {
                serverSelect.removeChild(child);
            }
        }
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
document.getElementById('add-server-modal-submit-button').addEventListener('click', (event) => {
    let serverName = document.getElementById('add-server-modal-server-name').value;
    let serverAddress = document.getElementById('add-server-modal-server-address').value;
    let serverUsername = document.getElementById('add-server-modal-server-username').value;
    let serverPassword = document.getElementById('add-server-modal-server-password').value;

    window.electron.invoke('get:data', 'accounts').then((accounts) => {
        if(!accounts.getAccountByName(serverName)) { // TODO: Make sure this is registered as a function.
            alert('Please enter a valid server name. This cannot be the same as any existing servers.');
            document.getElementById('add-server-modal-server-name').focus();
            return;
        }

        if (!serverRegex.test(serverAddress)) {
            alert('Please enter a valid server address. Comes in form: 0.0.0.0 where 0 is a number in range 0-255');
            document.getElementById('add-server-modal-server-address').focus();
            return;
        }

        // Encrypt the password.
        window.electron.protect('password', serverPassword).then((password) => {
            password = btoa(password.toString()); // Set the password to a base 64 encoded version of the buffer.
            window.electron.store_data('account', {
                name: serverName,
                ipAddr: serverAddress,
                username: serverUsername,
                password: password
            }).then((_) => {
                setupServers();
                document.getElementById('add-server-modal').style.display = "none";
            }); // Redo the server setup once the accounts have been added back in.
        });
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
        window.electron.invoke('get:data', 'accounts').then((accounts) => {
            let account = accounts.accounts.find(account => account.name === val);
                document.getElementById('edit-server-modal-previous-server-name').value = account.name;
                document.getElementById('edit-server-modal-server-name').value = account.name;
                document.getElementById('edit-server-modal-server-address').value = account.ipAddr;
                document.getElementById('edit-server-modal-server-username').value = account.username;
                document.getElementById('edit-server-modal-server-password').value = account.password;
        });

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
    // TODO: Get the reset function working. IE change div back into a function.
    document.title = startupTitle; // Restore the startup title.
}

document.getElementById('edit-server-modal-submit-button').addEventListener('click', (event) => {
    let previousServerName = document.getElementById('edit-server-modal-previous-server-name').value;
    let serverName = document.getElementById('edit-server-modal-server-name').value;
    let serverAddress = document.getElementById('edit-server-modal-server-address').value;
    let serverUsername = document.getElementById('edit-server-modal-server-username').value;
    let serverPassword = document.getElementById('edit-server-modal-server-password').value;

    window.electron.invoke('get:data', 'accounts').then((accounts) => {
        let prevServer = accounts.accounts.find(account => account.name === previousServerName);
        if(accounts.accounts.find(account => account.name === serverName) && serverName !== prevServer.name) {
            alert('Please enter a valid server name. This cannot be the same as any existing servers.');
            document.getElementById('edit-server-modal-server-name').focus();
            return;
        }
        if (!serverRegex.test(serverAddress)) {
            alert('Please enter a valid server address. Comes in form: 0.0.0.0 where 0 is a number in range 0-255');
            document.getElementById('edit-server-modal-server-address').focus();
            return;

        }
        let changedPassword = prevServer.password !== serverPassword;

        window.electron.store_data('delaccount', previousServerName).then((_) => {
            if (changedPassword) {
                window.electron.protect('password', serverPassword).then((newPass) => {
                    window.electron.store_data('account', {
                        name: serverName,
                        ipAddr: serverAddress,
                        username: serverUsername,
                        password: newPass
                    }).then((_) => {
                        setupServers();
                        document.getElementById('edit-server-modal').style.display = 'none';
                    });
                });
            } else {
                window.electron.store_data('account', {
                    name: serverName,
                    ipAddr: serverAddress,
                    username: serverUsername,
                    password: serverPassword
                }).then((_) => {
                    setupServers();
                    document.getElementById('edit-server-modal').style.display = 'none';
                })
            }
        })
    });
})

function connectServer() {
    const val = document.getElementById("server").value; // Get the dropdown box.

    // Check that the value of the item is valid
    if (val === "") { // If the value hasn't been set.
        alert("Please select a valid server!");
    } else {
        window.electron.send('load:main'); // Send the message to the IPC to load the main window.
    }
}