'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Thing = mongoose.model('Thing'),
  Character = mongoose.model('Character'),
  UserChars = mongoose.model('UserChars');

/**
 * Populate database with sample application data
 */

//Clear old things, then add things in
Thing.find({}).remove(function() {
  Thing.create({
    name : 'HTML5 Boilerplate',
    info : 'HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.',
    awesomeness: 10
  }, {
    name : 'AngularJS',
    info : 'AngularJS is a toolset for building the framework most suited to your application development.',
    awesomeness: 10
  }, {
    name : 'Karma',
    info : 'Spectacular Test Runner for JavaScript.',
    awesomeness: 10
  }, {
    name : 'Express',
    info : 'Flexible and minimalist web application framework for node.js.',
    awesomeness: 10
  }, {
    name : 'MongoDB + Mongoose',
    info : 'An excellent document database. Combined with Mongoose to simplify adding validation and business logic.',
    awesomeness: 10
  }, function() {
      console.log('finished populating things');
    }
  );
});

// add user/char relation
function createUserCharRelation(user, character1, character2) {
  UserChars.find({}).remove(function () {
    UserChars.create({
        _user: user,
        _chars: [character1, character2]
      }, function (err, userchar) {
        console.log('finished populating userchars');
      }
    );
  });
}

// add user/char relation
function createUserCharRelation2(user) {
  UserChars.find({}).remove(function () {
    UserChars.create({
        _user: user,
      }, function (err, userchar) {
        console.log('finished populating userchars');
      }
    );
  });
}

// add a character for testing
function addCharacter(user) {
  Character.find({}).remove(function () {
    Character.create( [
        {
          character_web_id: "pnms3m3cq4Y",
          class_name: "Spiritmaster",
          server_name: "Ywain1",
          master_level: {
            level: 10,
            path: "Convoker"
          },
          level: 50,
          realm_war_stats: {
            current: {
              bounty_points: 109961,
              played_time_minutes: 59674,
              player_kills: {
                albion: {
                  deaths: 0,
                  solo_kills: 5,
                  death_blows: 1904,
                  kills: 9771
                },
                hibernia: {
                  deaths: 0,
                  solo_kills: 3,
                  death_blows: 1674,
                  kills: 7978
                },
                total: {
                  deaths: 660,
                  solo_kills: 8,
                  death_blows: 3578,
                  kills: 17749
                }
              },
              realm_points: 6473219
            }
          },
          race: "Kobold",
          last_on_range: 4,
          crafting: {
            fletching: 1045,
            siegecraft: 1,
            spellcraft: 1004,
            alchemy: 1125,
            armorcraft: 1136,
            tailoring: 1120,
            weaponcraft: 1108
          },
          realm: 2,
          guild_info: {
            guild_web_id: "lzvWn3ITdvk",
            guild_name: "Fenrisbane",
            guild_rank: 9,
            insignia: {
              insignia_emblem_color: 0,
              insignia_pattern: 1,
              insignia_color_one: 8,
              insignia_color_two: 4,
              insignia_emblem: 50
            }
          },
          name: "Etilader"
        },
        {
          character_web_id: "rgIxFEe3u0Q",
          class_name: "Eldritch",
          server_name: "Ywain1",
          master_level: {
            level: 10,
            path: "Convoker"
          },
          level: 50,
          realm_war_stats: {
            current: {
              bounty_points: 9672,
              played_time_minutes: 53399,
              player_kills: {
                albion: {
                  deaths: 0,
                  solo_kills: 5,
                  death_blows: 1904,
                  kills: 9771
                },
                midgard: {
                  deaths: 0,
                  solo_kills: 3,
                  death_blows: 1674,
                  kills: 7978
                },
                total: {
                  deaths: 234,
                  solo_kills: 3,
                  death_blows: 3578,
                  kills: 5343
                }
              },
              realm_points: 3551152
            }
          },
          race: "Lurikeen",
          last_on_range: 4,
          crafting: {
            fletching: 1045,
            siegecraft: 1,
            spellcraft: 1004,
            alchemy: 1125,
            armorcraft: 1136,
            tailoring: 1120,
            weaponcraft: 1108
          },
          realm: 3,
          guild_info: {
            guild_web_id: "4dNGMz9Plqo",
            guild_name: "Herd of Donks",
            guild_rank: 9,
            insignia: {
              insignia_emblem_color: 0,
              insignia_pattern: 1,
              insignia_color_one: 8,
              insignia_color_two: 4,
              insignia_emblem: 50
            }
          },
          name: "Etiladerr"
        }
      ], function (err, character1, character2) {
        console.log('finished populating a character');
        createUserCharRelation(user, character1, character2);
      }
    );
  });
}

// Clear old users, then add a default user
User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'ett',
    name_lower: 'ett',
    email: 'wayne.lewter@fbitn.com',
    password: 'test'
  }, function( err, user ) {
      console.log('finished populating users');
      addCharacter(user);
    }
  );


  User.create({
      provider: 'local',
      name: 'bob',
      name_lower: 'bob',
      email: 'bob@bob.com',
      password: 'test'
    }, function( err, user ) {
      console.log('finished populating users');
      createUserCharRelation2(user);
    }
  );
});


