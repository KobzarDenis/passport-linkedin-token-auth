const LinkedIn = require("./linkedin")

class LinkedInTokenStrategy {

  constructor(options, verify) {
    this.name = 'linkedin-token';
    this._profileFields = options.profileFields;
    this._verify = verify;
  }

  authenticate(req, options) {
    if (req.query && req.query.denied) {
      return this.fail();
    }

    const token = req.body.access_token || req.query.access_token;

    this.loadUserProfile(token, (err, profile) => {
      if (err) {
        return this.error(err);
      }

      const verified = (err, user, info) => {
        if (err) {
          return this.error(err);
        }
        if (!user) {
          return this.fail(info);
        }
        this.success(user, info);
      };

      this._verify(profile, verified);
    });
  }

  loadUserProfile(token, res) {
    let fields = 'id,first-name,last-name,public-profile-url';
    if (this._profileFields) {
      fields = this.convertProfileFields(this._profileFields);
    }
    const linkedProfile = new LinkedIn(token, fields);
    linkedProfile.getProfile()
      .catch((err) => res(err))
      .then((data) => res(null, data));
  }

  convertProfileFields(profileFields) {
    return profileFields.join(',');
  }
}

module.exports = LinkedInTokenStrategy;
