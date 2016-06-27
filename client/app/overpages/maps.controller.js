/* Created by Leo on 13/06/2016. */
'use strict';

angular.module('myposApp')
  .controller('MapsCtrl', ['$scope','myPos','$http','Modal',
    function ($scope, myPos, $http,Modal) {
      $scope.searchText = '';

      function readCurrent() {
        $scope.current = myPos.session.map ? myPos.session.map._id : undefined;
      }

      $scope.set = function(map) {
        if (($scope.current && map && $scope.current == map._id) || (!$scope.current && !map)) return;
        var opt = Modal.confirm.getAskOptions(Modal.types.okcancel);
        opt.title = 'Set the map';
        opt.body = '<p>Confirm set map <strong>' + (map ? map.name : 'private map') + '</strong> ?</p>';
        Modal.show(opt)
          .then(function () {
            myPos.setMap(map)
              .then(readCurrent);
          });
      };

      $http.get('/api/maps')
        .then(function(resp){
          $scope.maps = resp.data;
        }, myPos.errHandler);

      readCurrent();
    }]);
