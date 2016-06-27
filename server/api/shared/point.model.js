'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var PointSchema = new Schema({
  id: String,
  type: String,
  map: String,
  user: String,
  icon: String,
  label: String,
  title: String,
  latitude: Number,
  longitude: Number,
  timestamp: Number
},{ versionKey: false });

module.exports = mongoose.model('Point', PointSchema);


