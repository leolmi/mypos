/* Created by Leo on 14/06/2016. */
'use strict';

angular.module('myposApp')
  .controller('AcceptCtrl', ['$scope',
    function ($scope) {
      if ($scope.modal.context.data.invitation.expiration > 0) {
        var now = new Date();
        var diff = $scope.modal.context.data.invitation.expiration - now.getTime();
        $scope.expdays = (diff / (1000 * 60 * 60 * 24)).toFixed(0);
      }
    }]);
