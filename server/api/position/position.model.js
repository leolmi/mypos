'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PositionSchema = new Schema({
  id: String,
  last: Boolean,
  title: String,
  label: String,
  type: String,
  owner: String,
  nick: String,
  map: String,
  latitude: Number,
  longitude: Number,
  accuracy: Number,
  altitude: Number,
  altitudeAccuracy: Number,
  heading: Number,
  speed: Number,
  timestamp: Number
},{ versionKey: false });

module.exports = mongoose.model('Position', PositionSchema);
