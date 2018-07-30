(function() {
  'use strict';

  angular
    .module('inspinia')
    .directive('mainTab', mainTab);

  function mainTab() {
    var directive = {
        templateUrl: '/app/directives/main-tab/main-tab.html',
        restrict: 'A'
    };
    return directive;
  }
})();