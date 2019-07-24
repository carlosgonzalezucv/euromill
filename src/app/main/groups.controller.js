(function() {
  'use strict';

  angular
    .module('inspinia')
    .controller('GroupsController', GroupsController);
    
  const SortNumbers = asc => (a,b) => asc * (a-b) / Math.abs(a-b);
  const MATRIX_SIZE = 4;
  const UNIT_MEASURE = 14;

  GroupsController.$inject = ['MainService', 'LEGService'];
  function GroupsController(MainService, LEGService) {
    let vm = this;
    
    
    vm.data = LEGService.computeLeg( MainService._results.map(e => e.results) );
    console.log("data", vm.data);
    formatData(vm.data);

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
  }
  Array.prototype.toXY = function () {
    let self = this;

    return self.filter(e => e > -1).map(position => {
      let offsetY = Math.floor(position / MATRIX_SIZE);
      let offsetX = position % MATRIX_SIZE;

      return [offsetX * UNIT_MEASURE, offsetY * UNIT_MEASURE].map(e => e + "px");
    });
  }
})();