'use strict';

var u = require('../../components/utils/utils');
var Position = require('./position.model');

exports.index = function(req, res) {
  var filter = {map: req.map.id, last:true};
  u.index(Position, req, res, filter);
};

exports.create = function(req, res) {
  req.body.map = req.map._id;
  req.body.last = true;
  if (!req.body.owner)
    return u.error(res, 'Undefined owner!');
  if (!req.body.nick)
    return u.error(res, 'Undefined nickname!');
  Position.findOne({
    map:req.body.map,
    owner:req.body.owner,
    last:true
  }, function(err, pos) {
    if (pos) {
      pos.last = false;
      pos.save(function (err) {
        u.create(Position, req, res);
      });
    } else {
      u.create(Position, req, res);
    }
  });
};
