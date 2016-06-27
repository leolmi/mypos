/* Created by Leo on 15/06/2016. */
'use strict';

angular.module('myposApp')
  .controller('SharedCtrl', ['$scope','myPos','maps','Modal','Logger','settings',
    function ($scope, myPos, maps, Modal, Logger,settings) {
      $scope.idle = null;
      $scope.settings = settings.data;
      $scope.data = {
        points: _.clone(myPos.data.points),
        ways: _.clone(myPos.data.ways),
        positions: _(myPos.data.positions)
          .filter(function(p) {
            return p.last;
          }).clone()
      };

      $scope.isMine = function(o) {
        return (o && o.owner==myPos.session.user._id);
      };

      $scope.activate = function(o) {
        $scope.activeObject = o;
      };

      function deleteSomething(type, o) {
        var opt = Modal.confirm.getAskOptions(Modal.types.delete, o.title);
        Modal.show(opt)
          .then(function() {
            myPos.delete(type, o._id);
          });
      }

      $scope.wayIsActive = function(way) {
        return maps.hasRoute(myPos.session.context, way._id);
      };

      $scope.pointDelete = function(p) {
        deleteSomething('point', p);
      };

      $scope.wayToggle = function(w) {
        if ($scope.idle) return;
        if ($scope.wayIsActive(w)) {
          maps.clearRoute(myPos.session.context);
        } else {
          $scope.idle = w._id;
          maps.calcRoute(myPos.session.context, w)
            .then(function() {
              $scope.idle = null;
              $scope.closeOverpage();
            }, function(err){
              Logger.error(err);
              $scope.idle = null;
            });
        }
      };

      $scope.wayDelete = function(w) {
        deleteSomething('way', w);
      };
    }]);
