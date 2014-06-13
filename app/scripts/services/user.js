(function () {
  'use strict';

angular.module('gimpchimpApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id?name=:name&email=:email', {
      id: '@id',
      name: '@name',
      email: '@email'
    }, { //parameters default
      update: {
        method: 'PUT',
        params: {}
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      },
      retrieve: {
        method: 'GET',
        params: {
        }
      }
	  });
  });

}());