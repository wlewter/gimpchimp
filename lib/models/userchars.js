'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * UserChars Schema
 */
var UserCharsSchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  _chars: [{ type: Schema.Types.ObjectId, ref: 'Character' }],
  updated: { type: Date, default: Date.now }
});

/**
 * Validations
 */
//ThingSchema.path('awesomeness').validate(function (num) {
//  return num >= 1 && num <= 10;
//}, 'Awesomeness must be between 1 and 10');

mongoose.model('UserChars', UserCharsSchema);
