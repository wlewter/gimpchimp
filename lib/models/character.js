'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Character Schema
 */
var CharacterSchema = new Schema({
  character_web_id: {type: String, index: {unique: true}},
  class_name: String,
  server_name: String,
  master_level: {
    level: Number,
    path: String
  },
  level: Number,
  realm_war_stats: {
    current: {
      bounty_points: Number,
      player_kills: {
        albion: {
          deaths: Number,
          solo_kills: Number,
          death_blows: Number,
          kills: Number
        },
        hibernia: {
          deaths: Number,
          solo_kills: Number,
          death_blows: Number,
          kills: Number
        },
        midgard: {
          deaths: Number,
          solo_kills: Number,
          death_blows: Number,
          kills: Number
        },
        total: {
          deaths: Number,
          solo_kills: Number,
          death_blows: Number,
          kills: Number
        }
      },
      realm_points: Number
    }
  },
  race: String,
  last_on_range: Number,
  crafting: {
    fletching: Number,
    siegecraft: Number,
    armorcraft: Number,
    tailoring: Number,
    weaponcraft: Number,
    spellcraft: Number,
    alchemy: Number
  },
  realm: Number,
  guild_info: {
    guild_web_id: String,
    guild_name: String,
    guild_rank: Number,
    insignia: {
      insignia_emblem_color: Number,
      insignia_pattern: Number,
      insignia_color_one: Number,
      insignia_color_two: Number,
      insignia_emblem: Number
    }
  },
  name: String,
  updated: { type: Date, default: Date.now }
});


/**
 * Validations
 */
//ThingSchema.path('awesomeness').validate(function (num) {
//  return num >= 1 && num <= 10;
//}, 'Awesomeness must be between 1 and 10');

mongoose.model('Character', CharacterSchema);
