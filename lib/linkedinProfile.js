const https = require("https");

class LinkedInProfile {

  constructor(accessToken, params) {
    this.accessToken = accessToken;
    this.headers = {};
    this.headers["Content-Type"] = "application/json";
    this.headers["Authorization"] = `Bearer ${this.accessToken}`;
    this.headers["x-li-format"] = "json";
    this.headers["x-li-msdk-ver"] = "1.1.4";
    this.headers["x-li-src"] = "msdk";
    this.request_options = {
      host: "api.linkedin.com",
      path: `/v1/people/~:(${params})`,
      method: "GET",
      headers: {...this.headers}
    }
  }

  getProfile() {
    return new Promise((resolve, reject) => {
      const req = https.request(this.request_options, (response) => {
        let data = "";
        response.on("data", (chunk) => {
          data += chunk;
        });
        response.on("end", () => {
          const result = JSON.parse(data);

          if (result.status && result.status > LinkedInProfile.ResponseCodes.ERRORS) {
            reject(result);
          }

          resolve(result);
        });
      });
      req.on("error", (err) => {
        reject(err);
      });
      req.end();
    });
  }
}

LinkedInProfile.ResponseCodes = {
  SUCCESS: 200,
  ERRORS: 400
};

LinkedInProfile.prototype.module.exports = LinkedInProfile;
