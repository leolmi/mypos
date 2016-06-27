'use strict';

angular.module('myposApp')
  .factory('Position', [function() {

    var Position = function(info, data) {
      this.keep(info);
      this.id = data ? data.id : '';
      this.title = data ? data.title : '';
      this.label = data ? data.label : '';
      this.type = data ? data.type : '';
      this.owner = data ? data.owner : '';
      this.nick = data ? data.nick : '';
    };
    Position.prototype = {
      id: '',
      title: '',
      label: '',
      owner: '',
      nick: '',
      type: '',
      last: false,
      latitude: null,
      longitude: null,
      altitude: null,
      accuracy: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
      timestamp: null,
      isValid:function() {
        return (this.latitude && this.longitude);
      },
      sameOf:function(pos) {
        return pos.latitude == this.latitude &&
          pos.longitude == this.longitude &&
          pos.altitude == this.altitude;
      },
      keep: function(pos) {
        if (!pos) return;
        this.id = pos.id;
        this.title = pos.title;
        this.label = pos.label;
        this.type = pos.type;
        this.owner = pos.owner;
        this.nick = pos.nick;
        if (pos.timestamp)
          this.timestamp = pos.timestamp;
        if (pos.coords) pos = pos.coords;
        this.latitude = pos.latitude;
        this.longitude = pos.longitude;
        this.altitude = pos.altitude;
        this.accuracy = pos.accuracy;
        this.altitudeAccuracy = pos.altitudeAccuracy;
        this.heading = pos.heading;
        this.speed = pos.speed;
      }
    };

    return (Position);
  }]);
