/* Created by Leo on 18/06/2016. */
'use strict';
angular.module('myposApp')
  .controller('OPTestCtrl', ['$scope',
    function($scope) {
      var items = [];
      for(var i=0;i<24;i++) {
        items.push({
          title: i+'. item di test n°'+(i+1)
        });
      }
      $scope.items = items;

      $scope.help = function(code) {
        $scope.helpStr = code;
      };
    }]);
