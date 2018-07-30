(function() {
  'use strict';

  angular
    .module('inspinia')
    .directive('graphDetails', graphDetails);

  graphDetails.$inject = ['MainService'];
  function graphDetails(MainService) {
    var directive = {
        templateUrl: '/app/directives/graph-details/graph-details.html',
        bindToController: true,
        controller: ['MainService', Controller],
        controllerAs: 'vm',
        link: link,
        restrict: 'E',
        require: '^linePlot',
        scope: {
          data: '=',
          className: '=?'
        }
    };
    return directive;
    
    function link(scope, element, attrs) {
      scope.$watch('vm.data', updateValues.bind(this, scope.vm, MainService));
    }
  }
  /* @ngInject */
  function Controller (MainService) {
    let vm = this;
    if(!vm.data)
      return;
    updateValues(vm, MainService);
  }
  function updateValues (vm, MainService) {
    let {max, min} = Math;
    if (!vm.data) 
      return;
    vm.maxValue = max.apply([], vm.data);
    vm.minValue = min.apply([], vm.data);
    vm.mean = vm.data.reduce(add) / vm.data.length;
    var hist = MainService.getHistogram(vm.data, vm.maxValue), aux = max.apply([], hist);
    vm.salidor = hist.indexOf(aux);
    vm.veces = aux;
  }
  function add (a,b) {
    return a + b;
  }
})();