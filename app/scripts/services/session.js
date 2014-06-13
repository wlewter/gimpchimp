(function () {
  'use strict';

angular.module('gimpchimpApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });

}());