(function () {
  'use strict';

angular.module('gimpchimpApp')
  .controller('LoginCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    if( Auth.isLoggedIn() ) {
      $location.path('/show/' + $scope.currentUser.name);
      return;
    }

    $scope.login = function(form) {
      $scope.submitted = true;
      
      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/show/' + $scope.currentUser.name);
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors.other = err.message;
        });
      }
    };
  });

}());