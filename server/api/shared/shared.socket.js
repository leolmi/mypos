'use strict';

var Message = require('./message.model');
var Point = require('./point.model');
var Way = require('./way.model');

exports.register = function(socket) {
  Message.schema.post('save', function (o) {
    onSaveMessage(socket, o);
  });
  Message.schema.post('remove', function (o) {
    onRemoveMessage(socket, o);
  });
  Point.schema.post('save', function (o) {
    onSavePoint(socket, o);
  });
  Point.schema.post('remove', function (o) {
    onRemovePoint(socket, o);
  });
  Way.schema.post('save', function (o) {
    onSaveWay(socket, o);
  });
  Way.schema.post('remove', function (o) {
    onRemoveWay(socket, o);
  });
};

function onSaveMessage(socket, doc, cb) { socket.emit('message:save', doc); }
function onRemoveMessage(socket, doc, cb) {socket.emit('message:remove', doc);}
function onSavePoint(socket, doc, cb) { socket.emit('point:save', doc); }
function onRemovePoint(socket, doc, cb) {socket.emit('point:remove', doc);}
function onSaveWay(socket, doc, cb) { socket.emit('way:save', doc); }
function onRemoveWay(socket, doc, cb) {socket.emit('way:remove', doc);}
