(function () {
  'use strict';

angular.module('gimpchimpApp')
  .controller('AboutCtrl', function ($scope, $http) {

      $http.get('/api/changeLog').success(function (log) {
        $scope.changeLog = log;
      });


      $http.get('/api/featureReq').success(function (features) {
        $scope.features = features;
      });

  });

}());