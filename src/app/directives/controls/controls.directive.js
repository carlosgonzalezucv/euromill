(function() {
  'use strict';

  angular
    .module('inspinia')
    .directive('controls', controls);

  function controls() {
    var directive = {
        bindToController: true,
        templateUrl: '/app/directives/controls/controls.html',
        controller: ['$scope', ControlsController],
        controllerAs: 'vm',
        restrict: 'E',
        scope: {
          onChange: '='
        }
    };
    return directive;
  }
  /* @ngInject */
  function ControlsController ($scope) {
    var vm = this;
    console.log("$scope", $scope);
  }
})();