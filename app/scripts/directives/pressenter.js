(function () {
  'use strict';

  angular.module('gimpchimpApp')
    .directive('gcEnter', function() {
      return function(scope, element, attrs) {
        element.bind('keydown keypress', function(event) {
          if(event.which === 13) {
            scope.$apply(function(){
              scope.$eval(attrs.gcEnter, {'event': event});
            });

            event.preventDefault();
          }
        });
      };
    });

}());