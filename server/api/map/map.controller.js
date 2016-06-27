'use strict';

var Map = require('./map.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of maps
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  Map.find({}, '-salt -hashedPassword', function (err, maps) {
    if(err) return res.send(500, err);
    res.json(200, maps);
  });
};

/**
 * Creates a new map
 */
exports.create = function (req, res, next) {
  var newMap = new Map(req.body);
  newMap.provider = 'local';
  newMap.role = 'user';
  newMap.save(function(err, map) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: map._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Get a single map
 */
exports.show = function (req, res, next) {
  var mapId = req.params.id;

  Map.findById(mapId, function (err, map) {
    if (err) return next(err);
    if (!map) return res.send(401);
    res.json(map.profile);
  });
};

/**
 * Deletes a map
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  Map.findByIdAndRemove(req.params.id, function(err, map) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a map password
 */
exports.changePassword = function(req, res, next) {
  var mapId = req.map._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  Map.findById(mapId, function (err, map) {
    if(map.authenticate(oldPass)) {
      map.password = newPass;
      map.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get current map info
 */
exports.me = function(req, res, next) {
  var mapId = req.map._id;
  Map.findOne({
    _id: mapId
  }, '-salt -hashedPassword', function(err, map) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!map) return res.json(401);
    res.json(map);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
