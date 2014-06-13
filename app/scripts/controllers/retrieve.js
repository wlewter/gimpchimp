(function () {
  'use strict';

angular.module('gimpchimpApp')
  .controller('RetrieveCtrl', function ($scope, User, Auth) {
    $scope.errors = {};

    $scope.retrievePassword = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.retrievePassword( $scope.name, $scope.email )
        .then( function() {
          $scope.message = 'New password emailed.';
        })
        .catch( function(err) {

          if( err.status === 404 ) {
            if( $scope.email === '') $scope.message = 'Display ID not valid.';
            else $scope.message = 'Email address not valid.';
          } else {
            $scope.message = 'Error trying to email password.';
          }
        });
      }
		};
  });

}());