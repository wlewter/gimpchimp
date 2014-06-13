(function () {
  'use strict';

angular.module('gimpchimpApp')
  .controller('ContactCtrl', function ($scope, $http) {

    $scope.reset = function(form) {
      $scope.message = '';
      $scope.submitted = false;
      form.$setPristine();
    };

    if( $scope.currentUser )
      $scope.email = $scope.currentUser.email;

    $scope.contact = function(form) {
      $scope.submitted = true;

      if( form.$valid) {

        $http
          .post('/api/contact', {email: $scope.email, message: $scope.message})
          .success(function (res) {
            $scope.retMessage = 'Message sent successfully';
            $scope.reset(form);
          })
          .error(function (err) {
            $scope.retMessage = 'Message failed to be sent. You can contact me directly by emailing etilader@gmail.com';
          });
      }
    }
  });

}());