'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Change Schema
 */
var ChangeSchema = new Schema({
  changeDesc: String,
  changeDate: { type: Date, default: Date.now }
});

mongoose.model('Change', ChangeSchema);
