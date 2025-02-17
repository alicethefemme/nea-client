class Accounts {
    accounts = [];
    constructor(accounts) {
        for(let account of accounts) {
            accounts.concat(new Account(account['name'], account['ipAddr'], account['username'], account['password']));
        }
    }

    /**
     * Returns the names of the accounts in the Accounts.
     * @returns {String[]} The names of the accounts
     */
    getAccountNames() {
        let accountNames = [];
        for(let account of this.accounts) {
            accountNames.push(account.name);
        }

        return accountNames;
    }
}

class Account {
    name;
    ipAddr;
    username;
    password;
    constructor(name, ipAddr, username, password) {
        Object.assign(this, {
            name: '',
            ipAddr: '',
            username: '',
            password: ''
        }, {name, ipAddr, username, password})
    }

    getValues() {
        return {
            name: this.name,
            ipAddr: this.ipAddr,
            username: this.username,
            password: this.password
        }
    }
}

module.exports = {
    Accounts,
    Account
}