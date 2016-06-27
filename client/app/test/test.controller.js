/* Created by Leo on 18/06/2016. */
'use strict';

angular.module('myposApp')
  .controller('TestCtrl', ['$scope','Modal','Logger',
    function($scope,Modal,Logger) {

      function handlerErr(err){
        Logger.error('Error', err);
      }

      function handlerOk() {
        Logger.info('test OK!');
      }

      function testRoute() {
        var opt = {
          title: 'Route',
          template: Modal.templates.route,
          routeInfos: {
            way: {
              title: 'Route'
            },
            info: 'Distance: 1,43 Km\nDuration: 1h 23',
            details: [{
              distance: '1Km',
              duration: '34m',
              instructions: 'Tutto a dritto <b>Imbecille</b> fino alla fine'
            },{
              distance: '430m',
              duration: '51m',
              instructions: 'Vai piano che c\'è  traffico <b>Imbecille!</b>'
            },{
              distance: '2m',
              duration: '4ms',
              instructions: 'buca <b>Imbecille</b> l\'hai presa piena'
            },{
              distance: '8m',
              duration: '2s',
              instructions: 'Asdf asdf asdf asdfasd flkajsdlf a jslfjas ldfjalsdk f jal ksdfj af as dfas dfasd.\nFas fjahs df askjf akjsd ks fjk asfj asdf akjf kasdfkasd fak sdh asda.'
            },{
              distance: '2m',
              duration: '4ms',
              instructions: 'buca <b>Imbecille</b> l\'hai presa piena'
            },{
              distance: '8m',
              duration: '2s',
              instructions: 'Asdf asdf asdf asdfasd flkajsdlf a jslfjas ldfjalsdk f jal ksdfj af as dfas dfasd.\nFas fjahs df askjf akjsd ks fjk asfj asdf akjf kasdfkasd fak sdh asda.'
            }]
          },
          ok: true,
          cancel: false
        };
        Modal.show(opt, 'popup')
          .then(handlerOk, handlerErr);
      }

      $scope.closeOverpage = function() {
        $scope.overpage = undefined;
      };

      function testOverpage() {
        $scope.overpage = {
          name: 'Test Overpage',
          template: 'app/test/overpage-test.html',
        };
      }

      $scope.tests = [{
        name:'Test Route',
        description: 'Test del modale che rappresenta il percorso calcolato',
        action: testRoute
      },{
        name:'Test Overpage',
        description: 'Overpage test',
        action: testOverpage
      }];

    }]);
