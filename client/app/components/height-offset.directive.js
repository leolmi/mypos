/* Created by Leo on 18/06/2016. */
'use strict';

angular.module('myposApp')
  .directive('heightOffset',['$timeout','$window',
    function ($timeout,$window) {
      return {
        restrict: 'A',
        link: function (scope, ele, atr) {
          var offset = atr['heightOffset'];
          offset = offset ? parseInt(offset) : 0;

          function setHeight() {
            var h = window.innerHeight - offset;
            ele.css('min-height', h + 'px');
            ele.css('max-height', h + 'px');
          }

          $(window).on("resize.doResize", function() {
            scope.$apply(setHeight());
          });

          scope.$on('$destroy', function(){
            $(window).off("resize.doResize");
          });
          $timeout(setHeight, 100);
        }
      }
    }]);
