(function() {
  'use strict';

  angular
    .module('inspinia')
    .directive('axesSelector', axesSelector);

  function axesSelector() {
    var directive = {
        templateUrl: '/app/directives/axes-selector/axes-selector.html',
        bindToController: true,
        controller: Controller,
        controllerAs: 'vm',
        link: link,
        restrict: 'E',
        scope: {
          onupdate: '&'
        }
    };
    return directive;
    
    function link(scope, element, attrs) {
    }
  }
  /* @ngInject */
  function Controller () {
    let vm = this;
    vm.selection = [true, true, true, false, false];
    vm.labels = [1,2,3,4,5];
    vm.mixed = false;
    vm.currentSelection = vm.selection.filter(e => e).map((e,i) => i);
    vm.disabledIndexes = vm.selection.map(e => !e);

    vm.update = update;

    function update() {
      vm.currentSelection = vm.selection.map((e,i) => e ? i : -1).filter(e => e>-1);
      vm.disabledIndexes = vm.selection.map(e => selectorSize() < 3 ? false : !e);
      if (selectorSize() === 3) {
        vm.onupdate({selection: vm.currentSelection, mixed: vm.mixed});
      }
    }

    function selectorSize () {
      return vm.currentSelection.length;
    }
  }
})();