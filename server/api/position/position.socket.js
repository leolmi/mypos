'use strict';

var Position = require('./position.model');

exports.register = function(socket) {
  Position.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
};

function onSave(socket, doc, cb) {
  socket.emit('position:save', doc);
}
