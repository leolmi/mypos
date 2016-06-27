'use strict';

angular.module('myposApp')
  .controller('WayCtrl', ['$scope','myPos','uiUtil',
    function ($scope,myPos,uiUtil) {
      $scope.markers = _.clone(myPos.data.markers);
      $scope.addPoint =  function() {
        $scope.modal.context.way.points.push({});
      };
      $scope.removePoint =  function(p) {
        uiUtil.remove($scope.modal.context.way.points, p);
      };
      function getNextMode() {
        switch ($scope.modal.context.way.mode) {
          case 'car': return 'walk';
          case 'walk': return 'bicycle';
          case 'bicycle': return 'public';
          default: return 'car';
        }
      }
      $scope.toggleMode = function() {
        $scope.modal.context.way.mode = getNextMode();
      };
      $scope.getModeIcon = function() {
        switch ($scope.modal.context.way.mode) {
          case 'walk': return 'fa-male';
          case 'bicycle': return 'fa-bicycle';
          case 'public': return 'fa-bus';
          default: return 'fa-car';
        }
      };
    }]);
