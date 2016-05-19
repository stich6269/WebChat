var User = require('../models/user').User;
var HttpError = require('../error').HttpError;
var AuthError = User.AuthError;


exports.get = function (req, res) {
    res.render('login');
};

exports.post = function (req, res, next) {
    var username = req.body.username,
        password = req.body.password;

    User.authorise(username, password, function (err, user) {
        if (err) {
            if(err instanceof AuthError){
                return new HttpError(403, err.message);
            }else {
                return next(err);
            }
        }

        req.session.user = user._id;
        res.send({});
    });
};
