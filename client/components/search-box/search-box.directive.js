/* Created by Leo on 13/06/2016. */
'use strict';

angular.module('myposApp')
  .directive('searchBox', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'components/search-box/search-box.html',
      scope: { searchText:'=ngModel' },
      link: function(scope, ele, atr) {
        scope.clear = function() {
          scope.searchText = '';
        }
      }
    };
  });
