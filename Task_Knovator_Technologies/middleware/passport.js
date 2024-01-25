var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require("../model/user")

module.exports =

    function (passport) {
        var params = {
            secretOrKey: process.env.SECRETKEY,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()   
        };
        passport.use(
            new JwtStrategy(params, function (jwt_payload, next) {
                let id = jwt_payload._id
                User.findOne({ _id: id })
                    .then(user => {
                        if (user) {
                            return next(null, user);
                        } else {
                            return next(null, false);
                        }
                    })
                    .catch(err => {
                        return next(err, false);
                    });

            })
        );
    };
