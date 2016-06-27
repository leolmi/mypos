
'use strict';

angular.module('myposApp')
  .factory('uiUtil', ['$window',
    function($window) {
      var $menu = null;

      $window.onmouseup = function(e) {
        if ($menu) { // && !$menu.is(e.target) && $menu.has(e.target).length === 0)
          $menu.removeClass('open');
          $menu = undefined;
        }
      };

      function toggleClass($target, className) {
        if ($target.hasClass(className)) {
          $target.removeClass(className);
        } else {
          $target.addClass(className);
        }
      }

      function toggleMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        $menu = $(e.currentTarget.parentElement);
        toggleClass($menu, 'open');
      }

      function guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
      }

      function remove(arr, item) {
        if (!arr || !_.isArray(arr) || !item) return;
        var index = arr.indexOf(item);
        if (index>-1)
          arr.splice(index, 1);
      }

      function addOrReplace(arr, item, equal, replace) {
        if (!arr || !_.isArray(arr) || !item) return;
        var ex = _.find(arr, function(i) {
          return equal(i, item);
        });
        if (ex) {
          replace(ex, item);
        } else {
          arr.push(item);
        }
      }


      return {
        toggleMenu:toggleMenu,
        guid:guid,
        remove: remove,
        addOrReplace: addOrReplace
      }
    }]);
