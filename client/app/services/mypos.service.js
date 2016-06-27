'use strict';

angular.module('myposApp')
  .factory('myPos', ['$q','$location','$timeout','$rootScope','$http','socket','maps','uiUtil','Logger','Position',
    function($q,$location,$timeout,$rootScope,$http,socket,maps,uiUtil,Logger,Position) {
      var SETTINGS = 'MYPOS-SETTINGS';
      var _session = {
        map: {},
        nick: null,
        id: null,
        context: null,
        center: []
      };
      var _data = {
        maps: [],
        markers: [],
        points: [],
        messages: [],
        ways: [],
        positions: [],
        clearMarkers:function() {
          this.markers.forEach(function(m){
            if (m) {
              google.maps.event.clearListeners(m, 'click');
              m.setMap(null);
            }
          });
          this.markers.splice(0);
        },
        reset: function(full) {
          this.clearMarkers();
          this.markers = [];
          this.points = [];
          this.positions = [];
          this.messages = [];
          this.ways = [];
          if (full)
            this.maps = [];
        }
      };
      var _options = {
        active: true,
        delay: 1000,
        centerFirst: true,
        centerLocked: false,
        notify: {
          active: true,
          maps: true,
          points: true,
          messages: true,
          ways: true
        },
        monitor:{
          visible: true
        },
        locationOptions:{
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      };
      var _shared = [{
        name:'points',
        socketName: 'point',
        cb: refreshMarkers
      },{
        name:'messages',
        socketName: 'message'
      },{
        name:'ways',
        socketName: 'way'
      }];
      var _last = new Position();

      function loadSettings() {
        var s = {};
        if (typeof(Storage) !== 'undefined') {
          var str = localStorage.getItem(SETTINGS);
          if (str) s = JSON.parse(str) || {};
        }
        _session.nick = s.nick;
        _session.map.name = s.map;
        _session.id = s.id || uiUtil.guid();
        _session.center = [_session.id];
      }

      function saveSettings() {
        if (typeof(Storage)!=='undefined') {
          var s = {
            map: _session.map.name,
            nick: _session.nick,
            id: _session.id
          };
          localStorage.setItem(SETTINGS, JSON.stringify(s));
        }
      }

      $rootScope.$on('MAP-LOGIN', function() {
        saveSettings();
      });


      function reset(info) {
        _session.nick = info ? info.nick : '';
        _session.map = info ? {name:info.name} : {};
        _session.center = (info && info.id) ? [info.id] : [];
        _session.context = null;

        _options.active = true;
        _options.delay = 1000;
        _options.centerFirst = true;
        _options.centerLocked = false;
        _options.monitor.visible = true;

        // _data.reset(full);

        _last = new Position();
        if (!info)
          loadSettings();
      }

      function setZoom(zoom) {
        if (!zoom || !_session.context) return;
        var listener = google.maps.event.addListener(_session.context.map, "idle", function() {
          _session.context.map.setZoom(zoom);
          google.maps.event.removeListener(listener);
        });
      }

      /**
       * centra la mappa
       */
      function centerMap(pos, zoom, finder) {
        if (!_session.context || !pos) return;
        // il centro è considerato più in alto per
        // lasciare lo spazio al monitor
        var bounds = _session.context.map.getBounds();
        if (!bounds) return;

        // Calcola le coordinate del centro
        var gpos = maps.getLatLng(pos);

        // Imposta il centro della mappa
        _session.context.map.setCenter(gpos);

        var mrk = finder ? finder() : null;
        if (mrk) {
          // Se ha trovato il marker lo anima
          mrk.setAnimation(google.maps.Animation.BOUNCE);
          $timeout(function () {
            mrk.setAnimation(null);
          }, 1000);
        }
        setZoom(zoom);
      }

      function centerUser(pos, zoom) {
        if (!pos && _last.isValid()) {
          pos = maps.getLatLng(_last);
        }
        centerMap(pos, zoom);
      }


      function internalCheckInvitation() {
        if ($location.path()=='/map') {
          _session.invitation = $location.hash();
        }
      }

      function checkInvitation() {
        return $q(function(resolve){
          if (!_session.invitation) return resolve();
          $http.get('/api/invitations/' + _session.invitation)
            .then(function (resp) {
              resolve(resp.data);
            }, function(err){
              if (err.data) console.log(err.data);
              resolve();
            });
        });
      }

      function checkGeo() {
        return $q(function (resolve, reject) {
          if (!navigator.geolocation)
            return reject('Geolocation is not supported by this browser.');
          navigator.geolocation.getCurrentPosition(function () {
            resolve();
          }, function () {
            reject('Geolocation is not available.');
          });
        });
      }

      function internalReadPosition() {
        return $q(function(resolve, reject) {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject, _options.locationOptions);
          }
          else {
            reject(new Error('Geolocation is not supported by this browser.'));
          }
        });
      }

      function checkCenter() {
        var ms = [];
        _session.center.forEach(function(c){
          var m = _.find(_data.markers, function(xm) {
            return xm.myPos.id==c;
          });
          if (m) ms.push(m);
        });

        if (ms.length==1) {
          centerMap(ms[0]);
        } else if (ms.length>1) {

          ms.forEach(function(m){

          });
        }

        //var s = _session;
        //console.log('CENTRA LA MAPPA!');
      }

      /**
       * Legge la posizione corrente
       * @returns {*}
       */
      function readPosition() {
        return $q(function(resolve, reject) {
          internalReadPosition()
            .then(function(pos){
              var npos = new Position(pos, {
                id: _session.id,
                owner: _session.id,
                nick: _session.nick,
                title: _session.nick,
                label: _session.nick.slice(0, 1),
                type: 'user'
              });
              _last = _last || new Position();
              if (!_last.sameOf(npos)) {
                _last.keep(npos);
                _last.last = true;
                $http.post('/api/positions', _last)
                  .then(function() {
                    resolve();
                  }, function(err){
                    reject(err);
                  })
                  .finally(checkCenter);
              } else {
                resolve();
              }
            }, function(err){
              reject(err);
            });
        });
      }

      function getMarkerIcon(url) {
        if (url) {
          return {
            url: url,
            size: new google.maps.Size(22, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(11, 40)
          }
        }
      }

      function getMarker(info) {
        if (!_session.context) return null;
        var latlnt = maps.getLatLng( info);
        var m = new google.maps.Marker({
          map: _session.context.map,
          label: info.label || 'P',
          position: latlnt,
          title: info.title || info.description,
          icon: getMarkerIcon(info.icon)
        });
        m.myPos = {
          id: uiUtil.guid()
        };
        _.extend(m.myPos, info);
        google.maps.event.addListener(m, 'click', function() {
          if (m.map) $rootScope.$broadcast('CLICK-ON-MARKER', m);
        });
        return m;
      }

      function replaceOrAdd(m) {
        var index = -1;
        var exm = _.find(_data.markers, function (xm, xi) {
          index = xi;
          return xm.myPos.id == m.myPos.id;
        });
        if (exm) {
          _data.markers.splice(index, 1, m);
          exm.setMap(null);
        } else {
          _data.markers.push(m);
        }
      }

      function debugHandler(resp) {
        var msg = resp.data ? JSON.stringify(resp.data) : 'ok';
        Logger.info(msg);
      }

      function errHandler(err) {
        var msg = _.isObject(err) ? err.message || err.data : err;
        Logger.error('Error', msg);
      }

      function refreshMarkers() {
        _data.clearMarkers();
        //POSITIONS
        _data.positions = _data.positions || [];
        _data.markers = _(_data.positions)
          .filter(function(p){
            return p.last;
          })
          .map(function(p){
            return getMarker(p);
          }).value();
        //POINTS
        _data.points = _data.points || [];
        var pointsm = _.map(_data.points, function(p){
          return getMarker(p);
        });
        _data.markers.push.apply(_data.markers, pointsm);
        checkCenter();
      }

      function refreshPositions() {
        $http.get('/api/positions')
          .then(function (resp) {
            _data.positions = resp.data;
            socket.syncUpdates('position', _data.positions, refreshMarkers);
          }, errHandler);
      }



      function refreshShared() {
        if (!_session.map) {
          refreshMarkers();
          _data.messages = [];
        } else {
          _shared.forEach(function(s){
            $http.get('/api/shared/'+s.name+'/' + _session.map._id)
              .then(function (resp) {
                _data[s.name] = resp.data;
                socket.syncUpdates(s.socketName, _data[s.name], s.cb);
              }, errHandler);
          });
        }
      }

      function setMap(map) {
        return $q(function (resolve, reject) {
          function internalSetMap(map) {
            if (map && map.invite)
              map.invite.accepted = true;
            _session.map = map;
            resolve();
          }
          if (!map  || !map.invite || map.invite.accepted) {
            internalSetMap(map);
          } else {
            $http.post('/api/invitations/accept', map.invite)
              .then(function () {
                internalSetMap(map);
              }, errHandler);
          }
        });
      }

      function deleteMap(map) {
        if (map.invite) {
          $http.post('/api/invitations/refuse', map.invite)
            .then(function () {
              Logger.info('Invitation refused!')
            }, errHandler);
        } else {
          $http.delete('/api/map/'+map._id)
            .then(function () {
              Logger.info('Map deleted successfully!')
            }, errHandler);
        }
      }

      function share(type, data, cb) {
        cb = cb || angular.noop;
        var sharedobj = undefined;
        switch (type) {
          case 'point':
            sharedobj = {
              icon: data.icon,
              label: data.label,
              title: data.title,
              latitude: data.pos.lat(),
              longitude: data.pos.lng()
            };
            break;
          case 'message':
            sharedobj = {
              user: _session.user.name,
              text: data.text,
              action: data.action,
              icon: data.icon,
              type: data.type,
              timestamp: (new Date()).getTime()
            };
            break;
          case 'way':
            sharedobj = {
              title: data.title,
              notes: data.notes,
              mode: data.mode,
              points: data.points
            };
            break;
        }
        if (!sharedobj) return;
        sharedobj.type = type;
        sharedobj.id = type + '@' + uiUtil.guid();
        if (_session.map) {
          $http.post('/api/shared/' + type + '/' + _session.map._id, sharedobj)
            .then(function (o) {
              Logger.info('Object "' + type + '" shared successfully!');
              cb(o.data);
            }, errHandler);
        }
        else if (type == 'point') {
          _data.points.push(sharedobj);
          refreshShared();
        }
      }

      function getTypeIcon(type) {
        switch(type){
          case 'point': return 'fa-map-marker';
          case 'user': return 'fa-user';
          default: return 'fa-question-circle';
        }
      }

      function deleteShared(type, id) {
        $http.delete('/api/shared/' + type + '/' + id)
          .then(function () {
            Logger.info('Object "' + type + '" deleted successfully!');
          }, errHandler);
      }

      function refresh() {
        refreshPositions();
        // refreshShared();
      }


      // $rootScope.$watch(function() { return _session.map; }, function(){
      //   _last = new Position();
      //   _data.reset();
      //   refresh();
      //   $rootScope.$broadcast('CURRENT-MAP-CHANGED', _session.map);
      // });

      // internalCheckInvitation();

      var _centerTimeout = null;
      $rootScope.$on('CENTER-CHANGED', function(){
        if (_centerTimeout)
          $timeout.cancel(_centerTimeout);
        _centerTimeout = $timeout(function() {
          var c = _session.context.map.getCenter();
          var d = maps.calcDistance(c, _last);
          _session.distance = maps.getDistance(d);
        }, 1000);
      });
      
      

      loadSettings();
      //refresh();

      return {
        session: _session,
        options: _options,
        data: _data,
        lastPosition: _last,
        centerMap: centerMap,
        centerUser: centerUser,
        reset: reset,
        refresh: refresh,
        replaceOrAdd: replaceOrAdd,
        errHandler: errHandler,
        checkGeo: checkGeo,
        checkInvitation: checkInvitation,
        readPosition: readPosition,
        getMarker: getMarker,
        setMap: setMap,
        deleteMap: deleteMap,
        share: share,
        delete: deleteShared,
        getTypeIcon: getTypeIcon
      }
    }]);
