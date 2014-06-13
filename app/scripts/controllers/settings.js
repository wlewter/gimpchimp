(function () {
  'use strict';

angular.module('gimpchimpApp')
  .controller('SettingsCtrl', function ($scope, User, Auth) {
    $scope.errors = {};

    $scope.master = {};

    $scope.reset = function(form) {
      $scope.user = angular.copy($scope.master);
      $scope.submitted = false;
      form.$setPristine();
    };

    $scope.changePassword = function(form) {
      $scope.submitted = true;

      if($scope.user.confirmPassword !== $scope.user.newPassword) {
        return;
      }

      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
          $scope.reset(form);
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
        });
      }
		};
  });

}());