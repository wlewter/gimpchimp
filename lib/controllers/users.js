'use strict';

var mongoose = require('mongoose'),
    UserChars = mongoose.model('UserChars'),
    ObjectId = require('mongoose').Types.ObjectId,
    generatePassword = require('password-generator'),
    nodemailer = require("nodemailer"),
    config = require('../config/config'),
    User = mongoose.model('User');

/**
 * Create user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.save(function(err, user) {
    if (err) return res.json(400, err);

    var userChar = new UserChars({
      _user: new ObjectId(user._id)
    });
    userChar.save(function(err) {
      if (err) return res.json(400, err);

      req.logIn(newUser, function(err) {
        if (err) return next(err);

        return res.json(req.user.userInfo);
      });
    });
  });
};

/**
 *  Get profile of specified user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(404);

    res.send({ profile: user.profile });
  });
};

/**
 * Change password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return res.send(400);

        return res.send(200);
      });
    } else {
      return res.send(403);
    }
  });
};

/**
 * Retrieve password
 */
exports.retrievePassword = function(req, res, next) {
  var name = req.query.name;
  var email = req.query.email;

  User.findOne({$or:[{name: name},{email:email}]})
    .exec(function (err, user) {

      if( !user ) {
        return res.send(404);
      }

      var pw = generatePassword(12, false);

      user.hashedPassword = user.encryptPassword(pw);

      user.save(function(err, user) {

        if(err) {
          return res.send(500, err);

        }

        sendPWMail(user.email, pw, function(err) {
          if( err) {
            return res.send(500,err);
          }

          return res.send(200);
        });
      });
    });
};

/**
 * Get current user
 */
exports.me = function(req, res) {
  res.json(req.user || null);
};


function sendPWMail(to, pw, cb) {
  var smtpTransport = nodemailer.createTransport('SMTP', {
    service: 'Gmail',
    auth: {
      user: config.gmail.username,
      pass: config.gmail.password
    }
  });

  var text = 'Your new gimpChimp password is: ' + pw + '\nYou should change this password after logging in via the Settings page.';
  var mailOptions = {
    from: 'etilader@gmail.com',
    to: to,
    subject: 'gimpChimp password retrieval',
    text: text
  };

  smtpTransport.sendMail(mailOptions, cb);
}