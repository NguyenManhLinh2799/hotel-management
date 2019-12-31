const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User Model
const Staff = require('../models/staff');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            Staff.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'Email không tồn tại' });
                    }

                    // Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Mật khẩu không đúng' });
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        Staff.findById(id, function (err, user) {
            done(err, user);
        });
    });
}