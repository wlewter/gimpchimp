(function () {
  'use strict';

angular.module('gimpchimpApp')
  .controller('SearchCtrl', function ($scope, $http, $location, RealmRanks) {


    $scope.searchStr = $location.path().substring( $location.path().indexOf('/', 1) + 1, $location.path().length );

    if( $scope.searchStr !== '' ) {
      $scope.message = 'Retrieving information....';
      $http
        .get('/api/usersearch/' + $scope.searchStr)
        .success(function(res) {
          $scope.users = res;

          angular.forEach($scope.users, function (user) {

            user.totalRP = 0;
            angular.forEach(user._chars, function(char) {
              user.totalRP += char.realm_war_stats.current.realm_points;
            });

            user.rr = RealmRanks.getRR(user.totalRP);
          });

          delete $scope.message;
        });
    } else {
      delete $scope.users;
    }


    $scope.show = function(name) {
      $location.path('/s/' + name);
    }
  });

}());