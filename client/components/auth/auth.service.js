'use strict';

angular.module('myposApp')
  .factory('Auth', function Auth($location, $rootScope, $http, Map, $cookieStore, $q) {
    var currentMap = {};
    if($cookieStore.get('token')) {
      currentMap = Map.get();
    }

    return {

      /**
       * Authenticate map and save token
       *
       * @param  {Object}   map     - login info
       * @param  {Function} [callback] - optional
       * @return {Promise}
       */
      login: function(map, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/auth/local', {
          name: map.name,
          password: map.password
        }).
        success(function(data) {
          $cookieStore.put('token', data.token);
          currentMap = Map.get();
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          this.logout();
          deferred.reject(err);
          return cb(err);
        }.bind(this));

        return deferred.promise;
      },

      /**
       * Delete access token and map info
       *
       * @param  {Function}
       */
      logout: function() {
        $cookieStore.remove('token');
        currentMap = {};
      },

      /**
       * Create a new map
       *
       * @param  {Object}   map     - map info
       * @param  {Function} [callback] - optional
       * @return {Promise}
       */
      createMap: function(map, callback) {
        var cb = callback || angular.noop;

        return Map.save(map,
          function(data) {
            $cookieStore.put('token', data.token);
            currentMap = Map.get();
            return cb(map);
          },
          function(err) {
            this.logout();
            return cb(err);
          }.bind(this)).$promise;
      },

      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      changePassword: function(oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return Map.changePassword({ id: currentMap._id }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(map) {
          return cb(map);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Gets all available info on authenticated map
       *
       * @return {Object} map
       */
      getCurrentMap: function() {
        return currentMap;
      },

      /**
       * Check if a map is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        return currentMap.hasOwnProperty('role');
      },

      /**
       * Waits for currentMap to resolve before checking if map is logged in
       */
      isLoggedInAsync: function(cb) {
        if(currentMap.hasOwnProperty('$promise')) {
          currentMap.$promise.then(function() {
            cb(true);
          }).catch(function() {
            cb(false);
          });
        } else if(currentMap.hasOwnProperty('role')) {
          cb(true);
        } else {
          cb(false);
        }
      },

      /**
       * Check if a map is an admin
       *
       * @return {Boolean}
       */
      isAdmin: function() {
        return currentMap.role === 'admin';
      },

      /**
       * Get auth token
       */
      getToken: function() {
        return $cookieStore.get('token');
      }
    };
  });
