import errorAlert, { softErrorAlert } from "@/helpers/errorManager";
import { Buffer } from "buffer";
import CryptoJS from "crypto-js";
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import * as SQLite from "expo-sqlite";

if (typeof global.Buffer === "undefined") {
  global.Buffer = Buffer;
}

class ServerStore {
  db = null;

  async init() {
    try {
      this.db = await SQLite.openDatabaseAsync("storage");

      await this.db.runAsync(`
        CREATE TABLE IF NOT EXISTS servers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          ip TEXT NOT NULL,
          port TEXT NOT NULL,
          username TEXT NOT NULL,
          password TEXT NOT NULL
        )`);
    } catch (e) {
      errorAlert(
        "An error occured while trying to load the local encrypted storage.",
        e
      );
      return;
    }
  }

  /**
   * Gets an array of the servers stored on the local secure storage for the application.
   * @returns {Promise<Array>} The server object.
   */
  async getServers() {
    // Get the servers from the database.
    const servers = [];
    const dbServers = await this.db.getAllAsync("SELECT * from servers");
    for (const server of dbServers) {
      servers.push({
        name: server.name,
        ip: server.ip,
        port: server.port,
        username: server.username,
        password: server.password,
      });
    }

    return servers;
  }

  /**
   * Adds a server to the database store with the encrypted values for username and password.
   * @param {Object} serverObject The JSON object for server properties.
   * @returns {Promise<Boolean>} The success of adding the server.
   */
  async addServer(serverObject) {
    // Extrapolate and encrypt all values from the object here.
    const name = serverObject.name;
    const ip = serverObject.ip;
    const port = serverObject.port;
    const username = encrypt(serverObject.username);
    const password = encrypt(serverObject.password);

    // Update the database.
    try {
      await this.db.runAsync(
        "INSERT INTO servers (name, ip, port, username, password) VALUES (?, ?, ?, ?, ?)",
        [name, ip, port, username, password]
      );
      return true;
    } catch (e) {
      softErrorAlert(
        `An error occured while attempting to add the server to the database. Could this be an existing server? Error: ${e}`
      );
      return false;
    }
  }

  async deleteServer(serverObject) {
    // Extrapolate the information from the server object.
    const name = serverObject.name;
    const ip = serverObject.ip;
    const port = serverObject.port;
    const username = serverObject.username;
    const password = serverObject.password;

    // Delete item from the database.
    try {
      await this.db.runAsync(
        "DELETE FROM servers WHERE name=? AND ip=? AND port=? AND username=? AND password=?;",
        [name, ip, port, username, password]
      );
      return true;
    } catch (e) {
      softErrorAlert(
        `An error occured while attempting to delete a server. Maybe this server doesn\'t exist? Error: ${e}`
      );
      return false;
    }
  }

  async decryptInfo(item) {
    return await decrypt(item);
  }
}

async function generateRandomHex(bytes = 32) {
  const random = await Crypto.getRandomBytesAsync(bytes);
  return Buffer.from(random).toString("hex");
}

/**
 * Retrieves the encryption key from secure storage.
 * @returns {Promise<String>} The key value.
 */
async function getKey() {
  const ENCRYPTION_KEY_NAME = "db_encryption_key";

  let key = await SecureStore.getItemAsync(ENCRYPTION_KEY_NAME); // Gets the key from the secure local keychain.
  if (!key) {
    try {
      key = await generateRandomHex(32);
      await SecureStore.setItemAsync(ENCRYPTION_KEY_NAME, key);
    } catch (e) {
      console.error(e);
    }
  }
  return CryptoJS.enc.Hex.parse(key);
}

/**
 * Encrypts any text to be stored in the database.
 * @param {String} text The text value of the object you want to encrypt.
 * @returns {String} The encrypted value of the text.
 */
// TODO: Figure out what the issue is with encrypting values.
function encrypt(text) {
  // Get the key from storage.
  // const encodedKey = await getKey();

  // Log the value that needs encrypting.
  // console.log("Value to encrypt:", text);

  // try {
    // console.log("TEXT: ", text);
    // console.log("ENCODED KEY: ", encodedKey);
    // console.log(await CryptoES.AES.encrypt(text, encodedKey));
  // } catch (e) {
    // console.log(e.stack);
  // }

  // return CryptoES.AES.encrypt(text, encodedKey).toString();
  return text;
}

/**
 * Decrypts any text stored in the database.
 * @param {String} text The text stored in the database.
 * @returns {String} The decrypted value of the text.
 */
function decrypt(text) {
  // const encodedKey = await getKey();

  // const bytes = CryptoJS.AES.decrypt(text, encodedKey);

  // return bytes.toString();
  return text;
}

const serverStore = new ServerStore();

export default serverStore;
