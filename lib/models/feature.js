'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Feature Schema
 */
var FeatureSchema = new Schema({
  featureDesc: String,
  featureReqDate: { type: Date, default: Date.now },
  featureImplDate: { type: Date }
});

mongoose.model('Feature', FeatureSchema);
