import { softErrorAlert } from "./errorManager";

class Server {
  url;
  urlSecure;
  username;
  password;
  token;

  constructor(ip, port, username, password) {
    this.url = `http://${ip}:${port}`;
    this.urlSecure = `https://${ip}:${port}`;
    this.username = username;
    this.password = password;
  }

  async ping() {
    const fetchOptions = {
      method: "GET",
    };

    try {
      const response = await fetch(`${this.url}/status/ver`, fetchOptions);

      if(!response.ok) {
        console.warn("Ping failed: Server is not responding.");
        return false;
      }

      const body = await response.json();
      return body.name == "ServerCmdr";
    } catch (e) {
      console.log(`Ping failed with error: ${e}`);
      return false;
    }
  }

  async login() {
    const fetchOptions = {
      method: "GET",
    };

    const params = new URLSearchParams({
      username: this.username,
      password: this.password
    });

    try {
      // Getthe response from the server for logging in.
      const response = await fetch(`${this.url}/auth/login?${params}`, fetchOptions);

      // Check that the information provided is valid.
      if(await response.status === 401) {
        console.log("Login failed: Invalid username or password.");
        softErrorAlert("Invalid username or password.");
        return false;
      }
      
      // Check that the information provided is all there.
      if(await response.status === 400) {
        console.warn("Login failed: Missing username or password.");
        softErrorAlert("Missing username or password.");
        return false;
      }

      // Check if the server has sent an internal error.
      if(await response.status === 500) {
        console.warn("Login error: Server error during login.");
        softErrorAlert("There was an error with the server during login. Please try again later.");
        return false;
      }

      // Check for any unknown errors.
      if(!response.ok) {
        console.warn("Login failed: Unknown error.");
        console.log(response.status);
        softErrorAlert("There was an unknown error during login. Please try again later.");
        return false;
      }

      // Check the headers to see what requirements are needed.
      const body = await response.json();
      if(!body) {
        console.warn("Login failed: No response body.");
        softErrorAlert("There was an error with the server during login. Please try again later.");
        return false;
      }

      const method_required = !!body.method;

      if(!method_required) {
        const token = body.token;
      }

    } catch (e) {
      console.log(`Login failed with error: ${e}`);
      return false;
    }
  }
}

export default Server;
