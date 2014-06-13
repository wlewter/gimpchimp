(function () {
  'use strict';

angular.module('gimpchimpApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [
      {
        'title': 'Contact',
        'link': '/contact',
        'icon': 'fa-envelope'
      },
      {
        'title': 'About',
        'link': '/about',
        'icon': 'fa-info'
      }
    /*{
      'title': 'Home',
      'link': '/'
    }*//*, {
      'title': 'Settings',
      'link': '/settings'
    }*/];
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.logout = function() {
      Auth.logout()
        .then(function() {
          $location.path('/login');
        });
    };

    $scope.search = function() {
      if( $scope.searchStr !== '' ) {
        $location.path('/search/' + $scope.searchStr);
        $scope.searchStr = '';
      }
    }

  });

}());