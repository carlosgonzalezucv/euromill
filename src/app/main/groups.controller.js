(function() {
  'use strict';

  angular
    .module('inspinia')
    .controller('GroupsController', GroupsController);

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
        });

        doc.flatNumeros = doc.numeritos.map(numeritos => numeritos.flat());
      });
    }
  }
})();