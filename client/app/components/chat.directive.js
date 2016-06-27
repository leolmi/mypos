/* Created by Leo on 19/06/2016. */
'use strict';

angular.module('myposApp')
  .directive('chat',['$timeout','myPos',
    function ($timeout,myPos) {
      return {
        restrict: 'E',
        templateUrl: 'app/components/chat.html',
        scope: { options:'=' },
        link: function(scope, ele, atr) {
          scope.chatOptions = scope.options || {};
          _.defaults(scope.chatOptions, {
            maxlength: 300,
            timeout: 1000,
            enter: true
          });
          //scope.messages = ndo6.data.messages;
          scope.iconOptions = {
            description: false
          };
          var _sendTimeout = null;

          function reset() {
            scope.message = {
              icon: '',
              text: '',
              type: '',
              action: ''
            };
          }

          function send() {
            if (_sendTimeout || !scope.message.text) return;
            var msg = _.clone(scope.message);
            _sendTimeout = $timeout(function() {
              myPos.share('message', msg);
              _sendTimeout = null;
            }, scope.chatOptions.timeout);
            reset();
          }

          function scroll() {
            var $container = $('.chat-messages', ele);
            var $last = $(".chat-messages > .chat-message:last-child", ele);
            if ($last.length) {
              var top = $last.offset().top + $container.scrollTop();
              $container.animate({scrollTop: top}, 1000);
            }
          }

          scope.getDate = function(d) {
            var now = new Date();
            var date = new Date(d);
            return (now.toLocaleDateString() == date.toLocaleDateString()) ?
              date.toLocaleTimeString() : date.toLocaleString();
          };

          var _shift = false;
          ele.bind("keydown keypress", function (e) {
            if (e.which === 16)
              _shift = true;
            if(!_shift && e.which === 13 && scope.chatOptions.enter) {
              send();
              e.preventDefault();
              e.stopPropagation();
            }
          });
          ele.bind("keyup", function (e) {
            if (e.which === 16)
              _shift = false;
          });

          scope.$watch(function(){ return myPos.data.messages; }, function(){
            scope.messages = myPos.data.messages;
            $timeout(scroll, 200);
          }, true);

          scope.sendMessage = function() {
            send();
          };

          reset();
          //$timeout(scroll, 500);
        }
      }
    }]);
