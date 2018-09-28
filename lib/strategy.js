var LinkedinProfile = require("./linkedinProfile")

function LinkedInTokenStrategy(options, verify) {
    this.name = 'linkedin-token-auth';
    this._profileFields = options.profileFields;
    this._verify = verify;
}

LinkedInTokenStrategy.prototype.authenticate = function (req, options) {
    if (req.query && req.query.denied) {
        return this.fail();
    }

    var self = this;
    var token = req.body.access_token || req.query.access_token;

    self._loadUserProfile(token, function (err, profile) {
        if (err) {
            throw new err;
        }

        function verified(err, user) {
            if (err) {
                return self.error(err);
            }
            self.success(user);
        }

        self._verify(profile, verified);
    });
}

LinkedInTokenStrategy.prototype.success = function (profile) {
    console.log(profile);
};

LinkedInTokenStrategy.prototype._loadUserProfile = function (token, res) {
    var fields = 'id,first-name,last-name,public-profile-url';
    if (this._profileFields) {
        fields = this._convertProfileFields(this._profileFields);
    }
    const linkedProfile = new LinkedinProfile(token, fields);
    linkedProfile.getProfile().then(res);
};

LinkedInTokenStrategy.prototype._convertProfileFields = function (profileFields) {
    var map = {
        'id': 'id',
        'name': ['first-name', 'last-name'],
        'emails': 'email-address'
    };

    var fields = [];

    profileFields.forEach(function (f) {
        if (typeof map[f] === 'undefined') {
            return fields.push(f);
        }
        ;

        if (Array.isArray(map[f])) {
            Array.prototype.push.apply(fields, map[f]);
        } else {
            fields.push(map[f]);
        }
    });

    return fields.join(',');
}

module.exports = LinkedInTokenStrategy;