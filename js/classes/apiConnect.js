class APIConnection {
    token = '';
    #addr = '';
    constructor(token, addr) {
        if(typeof token === undefined || typeof addr === undefined) {
            throw new Error('Cannot initialize with undefined params')
        } else if (typeof token === null || typeof addr === null) {
            throw new Error('Cannot initialize with null params')
        }

        this.token = token;
        this.#addr = addr;

        return this;
    }

    static async init(username, password, addr) {
        const response = await fetch(`http://${addr}/api/authenticate/getToken`, {
            headers: {
                'Authorization': `Basic ${username} ${password}`
            }
        });

        if(!response.ok) {
            return null;
        }

        return new APIConnection(response.headers.get('XAuthToken'), addr);
    }
}

module.exports = {
    APIConnection
}