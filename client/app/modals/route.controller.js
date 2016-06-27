/* Created by Leo on 16/06/2016. */
'use strict';

angular.module('myposApp')
  .directive('routeDetail', [ function() {
    return {
      restrict: 'E',
      scope: { detail:'=ngModel', index:'=detailIndex' },
      templateUrl: 'app/modals/route-detail.html',
      link: function (scope, ele, atr) {

      }
    }
  }])
  .controller('RouteCtrl', ['$scope','myPos','maps',
    function ($scope,myPos,maps) {
      $scope.details = false;
      $scope.routeInfo = $scope.modal.context.routeInfos || maps.getRouteInfos(myPos.session.context);
      $scope.getModeIcon = function() {
        var mode = $scope.routeInfo.way ? $scope.routeInfo.way.mode : 'car';
        switch (mode) {
          case 'walk': return 'fa-male';
          case 'bicycle': return 'fa-bicycle';
          case 'public': return 'fa-bus';
          default: return 'fa-car';
        }
      };
      $scope.showDetails = function() {
        $scope.details = true;
      };
    }]);
