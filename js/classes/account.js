class Accounts {
    accounts = [];
    constructor(accounts) {
        for(let account of accounts) {
            this.accounts.push(new Account(account['name'], account['ipAddr'], account['username'], account['password']));
        }
        return this;
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

    /**
     * Returns the account for the name provided.
     * @param accountName The name of the account you want to get.
     * @returns {Account|undefined} The account requested with the name. Void if nonexistent.
     */
    getAccountByName(accountName) {
        this.accounts.find(account => account.name === accountName).then((val) => {
            return val;
        });
    }
    addAccount(account) {
        this.accounts.push(account);
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