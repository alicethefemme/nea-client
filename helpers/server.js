class Server {
  url;
  urlSecure;

  constructor(ip, port, username, password) {
    this.url = `http://${ip}:${port}`;
    this.urlSecure = `https://${ip}:${port}`;
  }

  async ping() {
    const fetchOptions = {
      method: "GET",
    };

    try {
      const response = await fetch(`${this.url}/status/ver`, fetchOptions);
      return true;
    } catch (e) {
      console.log(`It failed because ${e}`);
      return false;
    }

    // console.log(`This is the response: ${await response.status}`);

    // // Check that a valid code has been returned.
    // if (!response.ok) return false;

    // // Check that the response is a response from server commander.
    // return !!response.body.version;
  }
}

export default Server;
