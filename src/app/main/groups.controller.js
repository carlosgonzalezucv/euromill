(function() {
  'use strict';

  angular
    .module('inspinia')
    .controller('GroupsController', GroupsController);
    
  const SortNumbers = asc => (a,b) => asc * (a-b) / Math.abs(a-b);
  const MATRIX_SIZE = 4;
  const UNIT_MEASURE = 14;
  const OPERATION = "symmetricDifference";

  GroupsController.$inject = ['MainService', 'LEGService'];
  function GroupsController(MainService, LEGService) {
    let vm = this;
    vm.selectedIndex = 0;
    
    vm.data = LEGService.computeLeg( MainService._results.map(e => e.results) );
    vm.onChangeIndex = onChangeIndex;

    let aux = LEGService.playWithSets(OPERATION, vm.selectedIndex);
    formatData(vm.data);
    addSetOperation(vm.data);

    console.log(aux.length, vm.data.length);
    console.log("data", vm.data);

    function formatData(data) {
      data.forEach(doc => {
        doc.positions.forEach(row => {
          while (row.length < 5) {
            row.push( -1 );
          }
          row = row.sort(SortNumbers(1));
        });

        doc.coordinates = doc.positions.map(row => row.toXY());
        doc.flatNumeros = doc.numeritos.map(numeritos => numeritos.flat());
      });
    }

    function addSetOperation (data) {
      data.forEach((doc, index) => {
        if (index > 1) {
          doc.SetOperation = [...aux[ index - 2 ]].toXY();
        }
      });
    }

    function onChangeIndex () {
      aux = LEGService.playWithSets(OPERATION, vm.selectedIndex);
      addSetOperation(vm.data);
    }
  }
  Array.prototype.toXY = function () {
    let self = this;

    return self.filter(e => e > -1).map(position => {
      let offsetY = Math.floor(position / MATRIX_SIZE);
      let offsetX = position % MATRIX_SIZE;

      return [offsetX * UNIT_MEASURE, offsetY * UNIT_MEASURE];
    });
  }
})();