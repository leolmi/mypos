'use strict';

angular.module('myposApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, Map) {

    // Use the Map $resource to fetch all maps
    $scope.maps = Map.query();

    $scope.delete = function(map) {
      Map.remove({ id: map._id });
      angular.forEach($scope.maps, function(m, i) {
        if (m === map) {
          $scope.maps.splice(i, 1);
        }
      });
    };
  });
