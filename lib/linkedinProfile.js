const https = require("https");

function LinkedInProfile(accessToken, params) {
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

LinkedInProfile.prototype.getProfile = function () {
    return new Promise((resolve, reject) => {
        const req = https.request(this.request_options, (response) => {
            let data = "";
            response.on("data", (chunk) => {
                data += chunk;
            });
            response.on("end", () => {
                const userProfile = JSON.parse(data);
                resolve(userProfile);
            });
        });
        req.on("error", (err) => {
            reject(err);
        });
        req.end();
    });
}

module.exports = LinkedInProfile;
