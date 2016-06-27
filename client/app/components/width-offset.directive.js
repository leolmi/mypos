/* Created by Leo on 27/06/2016. */
'use strict';

angular.module('myposApp')
  .directive('widthOffset',['$timeout','$window',
    function ($timeout,$window) {
      return {
        restrict: 'A',
        link: function (scope, ele, atr) {
          var offset = atr['widthOffset'];
          offset = offset ? parseInt(offset) : 0;

          function setWidth() {
            var W = window.innerWidth - offset;
            var L = ele.offset().left;
            ele.css('width', (W-L) + 'px');
          }

          $(window).on("resize.doResize", function() {
            scope.$apply(setWidth());
          });

          scope.$on('$destroy', function(){
            $(window).off("resize.doResize");
          });
          $timeout(setWidth, 1000);
        }
      }
    }]);
