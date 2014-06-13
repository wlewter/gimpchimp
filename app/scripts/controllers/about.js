(function () {
  'use strict';

angular.module('gimpchimpApp')
  .controller('AboutCtrl', function ($scope, $http) {

      $http.get('/api/changeLog').success(function (log) {
        $scope.changeLog = log;
      });
  });

}());