'use strict';

angular.module('myposApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        authenticate: true,
        controller: 'MainCtrl'
      });
  });
