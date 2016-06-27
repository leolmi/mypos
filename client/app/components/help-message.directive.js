/* Created by Leo on 18/06/2016. */
'use strict';

angular.module('myposApp')
  .directive('helpMessage',[
    function () {
      return {
        restrict: 'A',
        link: function (scope, ele, atr) {
          var message = atr['helpMessage'];
          var scope = ele.scope();
          var action = scope ? scope['help'] : undefined;
          ele.on('mouseenter', function() {
            if (_.isFunction(action))
              scope.$apply(function() { action(message); });
          });
          ele.on('mouseleave', function() {
            if (_.isFunction(action))
              scope.$apply(function() { action(); });
          });
        }
      }
    }]);
