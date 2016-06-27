
'use strict';

var u = require('../../components/utils/utils');
var Message = require('./message.model');
var Point = require('./point.model');
var Way = require('./way.model');

function index(schema, req, res) {
  if (!req.params.id) return u.error(res, 'Undefined map!');
  var filter = {map:req.params.id};
  u.index(schema, req, res, filter);
}

function check(req, res, cb) {
  req.body.owner = req.user._id;
  req.body.map = req.params.id;
  req.body.timestamp = (new Date()).getTime();
  if (!req.body.map)
    return u.error(res, 'Undefined map!');
  cb();
}

exports.indexPoints = function(req, res) {
  index(Point, req, res);
};
exports.indexMessages = function(req, res) {
  index(Message, req, res);
};
exports.indexWays = function(req, res) {
  index(Way, req, res);
};

exports.createPoint = function(req, res) {
  check(req, res, function() {
    u.create(Point, req, res);
  });
};
exports.createMessage = function(req, res) {
  check(req, res, function() {
    u.create(Message, req, res);
  });
};
exports.createWay = function(req, res) {
  check(req, res, function(){
    u.create(Way, req, res);
  });
};

exports.destroyPoint = function(req, res) {
  u.destroy(Point, req, res);
};
exports.destroyMessage = function(req, res) {
  u.destroy(Message, req, res);
};
exports.destroyWay = function(req, res) {
  u.destroy(Way, req, res);
};
