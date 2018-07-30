(function() {
  'use strict';

  angular
    .module('inspinia')
    .directive('plotSelectors', plotSelectors);

  function plotSelectors() {
    var directive = {
        bindToController: true,
        templateUrl: '/app/directives/plot-selectors/plot-selectors.html',
        controller: _controller,
        controllerAs: 'vm',
        link: link,
        restrict: 'E',
        scope: {
          onchange: '&'
        }
    };
    return directive;
    
    function link(scope, element, attrs) {
      scope.$watch('vm.showMeans', scope.vm.onchange.bind(this, {_vm: scope.vm}));
      scope.$watch('vm.showLegend', scope.vm.onchange.bind(this, {_vm: scope.vm}));
      scope.$watch('vm.histogram', scope.vm.onchange.bind(this, {_vm: scope.vm}));
    }
  }
  /* @ngInject */
  function _controller () {
    let vm = this;
    vm.showMeans = vm.showLegend = vm.histogram = false;
  }
})();