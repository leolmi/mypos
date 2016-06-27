/* Created by Leo on 15/06/2016. */
'use strict';

angular.module('myposApp')
  .controller('MarkerCtrl', ['$scope', 'myPos',
    function ($scope,myPos) {
    function getStr() {
      var result = [];
      var info = $scope.modal.context.info;
      var exclude = ['_id','id','last','center','icon','map'];
      _.keys(info).forEach(function (k) {
        if (exclude.indexOf(k)<0 && k.indexOf('$')!=0) {
          var postfix = '';
          switch(k) {
            case 'timestamp':
              var dt = new Date(info[k]);
              result.push(k+': '+dt.toLocaleDateString()+' '+dt.toLocaleTimeString());
              break;
            case 'accuracy':
              postfix = 'm';
            default:
              if (info[k] != undefined)
                result.push(k+': '+info[k]+postfix);
              break;
          }
        }
      });
      return result.join('\n');
    }
    $scope.infoStr = getStr();
    $scope.markerIcon = myPos.getTypeIcon($scope.modal.context.info.type);
  }]);
