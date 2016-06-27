'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var WayItemSchema = new Schema({
  id: String,
  latitude: Number,
  longitude: Number
});

var WaySchema = new Schema({
  id: String,
  type: String,
  map: String,
  mode: String,
  user: String,
  title: String,
  notes: String,
  timestamp: Number,
  points: [WayItemSchema]
},{ versionKey: false });

module.exports = mongoose.model('Way', WaySchema);
