const axios = require("axios");
const nodeRSA = require("node-rsa");
const { isObjectEmpty } = require("./utils");

class Gefee {
  constructor() {
    this.AuthenticationToken = "";
    this.UserProfile = {};
  }

  updateState(newToken, userData) {
    this.AuthenticationToken = newToken;
    this.UserProfile = userData;
  }

  async getSession() {

    try {

      const session = await this.get(process.env.ENDPOINT_GET_PING, {
        AppKey: process.env.GEFFEE_APP_KEY,
      });

      const { SessionKey } = session.data.Result;
      const modulus = Buffer.from(session.data.Result.Key.Modulus, "hex");
      const exponent = Buffer.from(session.data.Result.Key.Exponent, "hex");

      const clearText = `{"Username":"${process.env.GEFEE_USERNAME}","Password":"${process.env.GEFEE_PASSWORD}","Key":null,"Culture":"ro"}`;
      const keyData = Buffer.from(clearText, "utf8");

      const key = new nodeRSA();
      key.keyPair.setPublic(modulus, exponent);
      key.setOptions({ environment: "node", encryptionScheme: "pkcs1" });
      const credentials = key.encrypt(keyData, "hex");

      const response = await this.get(process.env.ENDPOINT_GET_LOGIN, {
        AppKey: process.env.GEFFEE_APP_KEY,
        SessionKey: SessionKey,
        Credentials: credentials,
      });

      this.updateState(
        response.data.Result.AuthenticationToken,
        response.data.Result.UserProfile
      );

      return this;

    } catch (err) {
      console.error(err);
      return;
    }
  }

  async get(url_path, param_object) {
    let params = "";
    if (!isObjectEmpty(param_object)) {
      for (let [key, value] of Object.entries(param_object)) {
        if (key === "appKey" || key === "AppKey" || key === "app_key") {
          params += `${key}=${value}`;
        } else {
          params += `&${key}=${value}`;
        }
      }
    }
    return await axios.get(`${process.env.GEFEE_API_URL}${url_path}?${params}`);
  }

  async post(url_path, param_object, body_data) {
    let params = "";
    if (!isObjectEmpty(param_object)) {
      for (let [key, value] of Object.entries(param_object)) {
        if (key === "appKey" || key === "AppKey" || key === "app_key") {
          params += `${key}=${value}`;
        } else {
          params += `&${key}=${value}`;
        }
      }
    }
    return await axios.post(`${process.env.GEFEE_API_URL}${url_path}?${params}`, body_data);
  }

}

module.exports = new Gefee();
