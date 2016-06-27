'use strict';

angular.module('myposApp')
  .controller('LoginCtrl', ['$scope','$rootScope','$timeout','Auth','Map','$location', '$window', 'myPos','Logger',
    function ($scope, $rootScope, $timeout,Auth, Map, $location, $window, myPos, Logger) {
      $scope.errors = {};
      $scope.loading = false;
      $scope.product = $rootScope.product;
      $scope.map = {
        name: myPos.session.map.name,
        password: '',
        nick: myPos.session.nick,
        id: myPos.session.id
      };

      function setDefaultFocus() {
        var e = $('#default-control');
        if (e) e.focus();
      }

      function beforeSubmit(cb) {
        cb = cb || angular.noop;
        $scope.loading = true;
        $scope.errors = {};
        myPos.checkGeo()
          .then(function () {
            $scope.submitted = true;
            $timeout(cb, 100);
          }, function (err) {
            $scope.loading = false;
            Logger.error('Error', err);
          });
      }

      function logIn() {
        Auth.login($scope.map)
          .then(function () {
            myPos.reset($scope.map);
            $rootScope.$broadcast('MAP-LOGIN');
            $location.path('/main');
          })
          .catch(function (err) {
            $scope.errors.other = err.message;
            $scope.loading = false;
          });
      }

      function signUp(form) {
        Auth.createMap($scope.map)
          .then(function () {
            $location.path('/main');
          })
          .catch(function (err) {
            err = err.data;
            $scope.errors = {};
            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, function (error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.message;
            });
            $scope.loading = false;
          });
      }

      $scope.go = function (form, signup) {
        $scope.submitted = true;
        if (form.$valid) {
          beforeSubmit(function () {
            if (signup)
              signUp(form);
            else
              logIn();
          });
        } else {
          $scope.loading = false;
        }
      };

      $scope.loginOauth = function (provider) {
        $window.location.href = '/auth/' + provider;
      };

      $scope.test = function() {
        //
      };
    }]);
