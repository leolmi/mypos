// /* Created by Leo on 16/06/2016. */
// 'use strict';
//
// angular.module('myposApp')
//   .factory('settings', ['$rootScope','myPos',
//     function($rootScope,myPos) {
//       var SETTINGS = 'MYPOS-SETTINGS';
//
//       function load() {
//         var s = {};
//         if (typeof(Storage) !== 'undefined') {
//           var str = localStorage.getItem(SETTINGS);
//           if (str) s = JSON.parse(str) || {};
//         }
//         myPos.session.nick = s.nick;
//         myPos.session.map.name = s.map;
//       }
//
//       function save() {
//         if (typeof(Storage)!=='undefined') {
//           var s = {
//             map: myPos.session.map.name,
//             nick: myPos.session.nick
//           };
//           localStorage.setItem(SETTINGS, JSON.stringify(s));
//         }
//       }
//
//       $rootScope.$on('MAP-LOGIN', function() {
//         save();
//       });
//
//       load();
//     }]);
