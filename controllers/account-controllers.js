const bcrypt = require('bcryptjs');
const passport = require('passport');

var Staff = require('../models/staff');

// Login Page
exports.loginPage = (req, res) => {
	res.render('pages/login', { layout: 'auth-layout' });
}

// Register Page
exports.registerPage = (req, res) => {
	res.render('pages/register', { layout: 'auth-layout' });
}

// Register Handle
exports.registerHandle = (req, res) => {
    const { name, email, password, position } = req.body;
    let errors = [];

    if (errors.length > 0) {
        res.render('pages/register', { layout: 'auth-layout', errors });
    } else {
        // Validation passed
        Staff.findOne({ email: email })
            .then(user => {
                if (user) {
                    // User exists
                    errors.push({ msg: 'Email đã tồn tại. Vui lòng nhập email khác.' });
                    res.render('pages/register', { layout: 'auth-layout', errors });
                } else {
                    const newStaff = new Staff({ name, email, password, position });

                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newStaff.password, salt, (err, hash) => {
                            if (err) throw err;
                            // Set password to hashed
                            newStaff.password = hash;
                            // Save user
                            newStaff.save()
                                .then(user => {
                                    req.flash('success_msg', 'Bạn đã đăng ký thành công');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        }));
                }
            });
    }
}

// Login Handle
exports.loginHandle = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
}

// Logout Handle
exports.logoutHandle = (req, res) => {
    req.logout();
    req.flash('success_msg', 'Bạn đã đăng xuất');
    res.redirect('/users/login');
}

// Profile Page
// exports.profile = (req, res) => {
//     res.render('pages/account/profile', { user: req.user });
// }