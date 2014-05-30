(function () {
  'use strict';


angular.module('gimpchimpApp')
  .controller('AddCtrl', function ($scope, $http, REALM) {

    $scope.cluster = 'ywain';

    $scope.search = function() {
      if( $scope.name !== '' ) {
        $http
          .get('/api/search/' + $scope.name + '/' + $scope.cluster)
          .success(function(res) {
            $scope.chars = res;

            $http.get('/api/characters/' + $scope.currentUser.name).success(function (userchars) {

              for( var i = 0; i < $scope.chars.length; i++ ) {
                angular.forEach(userchars._chars, function(char) {
                  if( char.character_web_id == $scope.chars[i].character_web_id ) {
                    $scope.chars[i].alreadyAdded = true;
                  }
                });
              }

              angular.forEach($scope.chars, function (char) {
                char.realmStr = REALM[char.realm];
              });
            });

          });
      }
    };

    $scope.isMid = function(char) {
      return char.realmStr === 'Midgard';
    };
    $scope.isHib = function(char) {
      return char.realmStr === 'Hibernia';
    };
    $scope.isAlb = function(char) {
      return char.realmStr === 'Albion';
    };

    $scope.addChar = function(char, index) {
      char.alreadyAdded = true;
      $http
        .post('/api/add/' + $scope.currentUser.name + '/' + char.character_web_id)
        .success(function (res) {
        })
        .error(function (err) {
          char.alreadyAdded = false;
        });
    }
  });

}());
