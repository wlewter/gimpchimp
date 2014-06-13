(function () {
  'use strict';

angular.module('gimpchimpApp')
  .controller('MainCtrl', function ($scope, $http, Auth, $location) {
    if( Auth.isLoggedIn() ) {
      $location.path('/s/' + $scope.currentUser.name);
    } else {
      $location.path('/login');
    }
  });

}());