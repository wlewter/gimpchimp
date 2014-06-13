'use strict';

var mongoose = require('mongoose'),
    ObjectId = require('mongoose').Types.ObjectId,
    Thing = mongoose.model('Thing'),
    UserChars = mongoose.model('UserChars'),
    Character = mongoose.model('Character'),
    Change = mongoose.model('Change'),
    User = mongoose.model('User'),
    nodemailer = require('nodemailer'),
    config = require('../config/config'),
    Q = require('q'),
    moment = require('moment'),
    fs = require('fs'),
    rrFile = __dirname + '/../models/realm_ranks.json',
    request = Q.denodeify(require('request'));


/**
 * Get awesome things
 */
exports.awesomeThings = function(req, res) {
  return Thing.find(function (err, things) {
    if (!err) {
      return res.json(things);
    } else {
      return res.send(err);
    }
  });
};

/**
 * Contact
 */
exports.contact = function(req, res) {
  var contact = req.body;

  sendContactMail(contact.email, contact.message, function(err) {
    if( err) {
      return res.send(500, err);
    }

    return res.send(200);
  });

};


/**
 * Get characters
 */
exports.getCharacters = function(req, res) {
  var id = req.params.id;
  var refresh = req.query.refresh || false;

  findUser(id)
    .then(function(user) {
      findUserCharAndPopulate(user)
        .then(function(userchar) {

        // check updated time and refresh data if older than 24 hours
        var updatedWrapper = moment(userchar.updated);
        var nowWrapper = moment(new Date());
        var ids = [];
        if( nowWrapper.diff(updatedWrapper, 'days', true) > 1 || refresh) {

          userchar.updated = new Date();
          userchar.save( function(err) {
            if( err)
              console.log(err);
          });

          for(var i = 0; i < userchar._chars.length; i++) {
            var charUpdatedWrapper = moment(userchar._chars[i].updated);
            if( nowWrapper.diff(charUpdatedWrapper, 'hours', true) > 1) {
              ids.push(userchar._chars[i].character_web_id);
            }
          }

          var allPromise = Q.all(ids.map(getCharacterData));
          allPromise.then(function(data){

            var updateTasks = [];
            for(var i = 0; i < data.length; i++) {
              var newChar = JSON.parse(data[i]);
              newChar.updated = new Date();

              updateTasks.push(findAndUpdate(newChar));
            }

            Q.all(updateTasks)
              .then(function(charData) {
                for( var j = 0; j < userchar._chars.length; j++) {
                  for( var p = 0; p < charData.length; p++) {
                    if (userchar._chars[j].character_web_id == charData[p].character_web_id) {
                      userchar._chars[j] = charData[p];
                      break;
                    }
                  }
                }

                return res.json(userchar);
              }, function(err) {
                return res.send(500, err);
              });

            //return res.json(userchar);

          }, function(err) {
            console.log(err);
            return res.send(500, err);
          });

        } else {
          return res.json(userchar);
        }


      }, function(err) {
        return res.send(500, err);
      });




    }, function(err) {
      return res.send(500, err);
    });


};


/**
 * delete character
 */
exports.deleteCharacter = function(req, res) {
  var id = req.params.id;
  var charId = req.params.charId;

  findUser(id)
    .then( function(user) {

      deleteCharFromUserChar(user, charId)
        .then(function (data) {
          return res.json(data);
        }, function (err) {
          return res.json(500, err);
        }) },

      function (err) {
        return res.json(500, err);
      }
  );
};


/**
 * search for user
 */
exports.userSearch = function(req, res) {
  var id = req.params.id;

  User.find({name: new RegExp(id, 'i') }, '_id', function(err, users) {
    if( err) {
      return res.send(500, err);
    }
    UserChars.find({ _user: { $in: users } })
      .populate('_user', 'name')
      .populate('_chars', 'realm_war_stats.current.realm_points')
      .exec(function(err, userchars) {

      if( err) {
        return res.send(500, err);
      }


      return res.json(200, userchars);
    });

  });

};


/**
 * add character
 */
exports.addCharacter = function(req, res) {
  var id = req.params.id;
  var charId = req.params.charId;
  //var newChar = new Character(req.body);


  getCharacterData(charId)
    .then(function(body) {
      var newChar = JSON.parse(body);

      newChar.updated = new Date();

      findAndUpdate(newChar)
        .then(function( char) {

          findUser(id)
            .then(function(user) {
              updateCharInUserChar(user, char)
                .then(function(data) {
                  return res.send(data);
                }, function(err) {
                  return res.send(500, err);
                })
            }, function(err) {
              return res.send(500, err);
            })

        }, function(err) {
          return res.send(500, err);
        });

    }, function(err) {
      return res.send(500, err);
    });

};

/**
 * search for character
 */
exports.searchCharacters = function(req, res) {
  var name = req.params.name;
  var cluster = req.params.cluster;

  search(name, cluster)
    .then( function(chars) {
      var body = JSON.parse(chars);
      return res.send(body.results);
    },
    function(err) {
      return res.send(500, err);
    });
};

/**
 * Get change log
 */
exports.getChangeLog = function(req, res) {
  return Change.find(function (err, changes) {
    if (!err) {
      return res.json(changes);
    } else {
      return res.send(err);
    }
  });
};

/**
 * Add a change
 */
exports.addChange = function(req, res) {
  var newChange = new Change(req.body);
  newChange.save(function(err, change) {
    if (err) return res.json(400, err);

    return res.json(200, change);
  });
};


/**
 * retrieve realm rank information
 */
exports.realmRanks = function(req, res) {

  return fs.readFile(rrFile, function(err, rrData) {
    if( err) return res.send(500, {'error': 'Unable to read realm ranks file.'});

    return res.send(200, rrData);
  });

};


function sendContactMail(from, message, cb) {
  var smtpTransport = nodemailer.createTransport('SMTP', {
    service: 'Gmail',
    auth: {
      user: config.gmail.username,
      pass: config.gmail.password
    }
  });

  var text = 'email: ' + from + '\n' + message;

  var mailOptions = {
    to: 'etilader@gmail.com',
    subject: 'gimpChimp contact form',
    text: text
  };

  smtpTransport.sendMail(mailOptions, cb);
}



function search(searchStr, cluster) {
  var url = 'https://broadsword:HmY4aQms@heraldsearch-dev.broadsword.com/character/search?name=' + searchStr + '&cluster=' + cluster;
  var response = request({
    uri: url,
    method: 'GET'
  });
  return response.then(function(res) {

    if(res[0].statusCode >= 300) {
      throw new Error('Server responded with status code: ' + res[0].statusCode);
    } else {
      return res[1];
    }
  });
}

function getCharacterData(id) {
  var url = 'https://broadsword:HmY4aQms@heraldsearch-dev.broadsword.com/character/info/';
  var response = request({
    uri: url + id,
    method: 'GET'
  });
  return response.then(function(res) {

    if(res[0].statusCode >= 300) {
      throw new Error('Server responded with status code: ' + res[0].statusCode);
    } else {
      return res[1];
    }
  });
}


function findAndUpdate(newChar) {
  var response = Character
                  .findOneAndUpdate( {character_web_id: newChar.character_web_id}, newChar, {upsert: true}).exec();

  return response.then( function(char) {
    return char;
  });
}

function findUserCharAndPopulate(user) {
  var response = UserChars
    .findOne({ _user: user._id })
    .populate('_chars')
    .populate('_user', 'name email')
    .exec();

  return response.then( function( userchar) {
    return userchar;
  });

}

function updateCharInUserChar(user, char) {
  var response = UserChars
                  .update({ _user: user._id },
                  { $push: {_chars: new ObjectId(char._id)} }).exec();

  return response.then(function() {
    return 200;
  });
}

function deleteCharFromUserChar(user, charId) {
  var response = UserChars
          .update({ _user: user._id },
          { $pull: {_chars: new ObjectId(charId)} }).exec();

  return response.then( function() {
    return 200;
  });
}

function findUser(id) {
  var response = User
    .findOne({name: id})
    .exec();

  return response.then( function(user) {
    if( !user ) throw Exception('user not found');
    return user;
  });
}
