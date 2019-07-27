(function () {
  'use strict';

  angular
    .module('inspinia')
    .controller('GroupsController', GroupsController);

  const SortNumbers = asc => (a, b) => asc * (a - b) / Math.abs(a - b);
  const OPERATION = "symmetricDifference";

  GroupsController.$inject = ['MainService', 'LEGService'];

  function GroupsController(MainService, LEGService) {
    let vm = this;
    vm.selectedIndex = 0;
    vm.showSetOperation = true;
    vm.operation = OPERATION;

    vm.data = LEGService.computeLeg(MainService._results.map(e => e.results));
    vm.onChangeIndex = onChangeIndex;
    vm.onOperationChange = onOperationChange;

    let aux = LEGService.playWithSets(vm.operation, vm.selectedIndex);
    formatData(vm.data);
    addSetOperation(vm.data);

    console.log(aux.length, vm.data.length);
    console.log("data", vm.data);

    function formatData(data) {
      data.forEach(doc => {
        doc.positions.forEach(row => {
          while (row.length < 5) {
            row.push(-1);
          }
          row = row.sort(SortNumbers(1));
        });

        doc.flatNumeros = doc.numeritos.map(numeritos => numeritos.flat());
      });
    }

    function addSetOperation(data) {
      data.forEach((doc, index) => {
        if (index > 1) {
          doc.SetOperation = [...aux[index - 2]].toBinaryArray(16);
        }
      });
    }

    function onChangeIndex() {
      aux = LEGService.playWithSets(vm.operation, vm.selectedIndex);
      addSetOperation(vm.data);
    }

    function onOperationChange() {
      onChangeIndex();
    }
  }
})();