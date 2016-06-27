'use strict';

angular.module('myposApp')
  .controller('PositionCtrl', ['$scope', function ($scope) {
    $scope.marker = $scope.modal.context.marker;
    $scope.pos = 'latitude: '+$scope.marker.pos.lat()+ '\nlongitude: '+$scope.marker.pos.lng();
    var geocoder = google ? new google.maps.Geocoder() : undefined;
    if (geocoder) {
      $scope.geocoding = true;
      geocoder.geocode({'location': $scope.marker.pos}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            $scope.result = results[0].formatted_address; // + '\n' + results[1].formatted_address;
            $scope.marker.title = $scope.marker.title || results[1].formatted_address;
          } else {
            $scope.error = 'No results found';
          }
        } else {
          $scope.error = 'Geocoder failed due to: ' + status;
        }
        $scope.geocoding = false;
      });
    }

    //TODO:
    // - scelta colore


  }]);
