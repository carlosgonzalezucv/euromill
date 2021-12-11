(function () {
  "use strict";

  angular.module("inspinia").controller("TablesController", TablesController);

  TablesController.$inject = ["MainService", "TableService"];
  function TablesController(MainService, TableService) {
    let vm = this;

    vm.compressed = false;
    vm.data = [];
    vm.dateRange = {
      start: new Date(Date.now() - 365 * 24 * 3600 * 1000),
      end: new Date(),
    };
    
    filterResultsByDateRange();
    
    vm.validateRange = validateRange;
    vm.togleCompression = togleCompression;

    function togleCompression() {
      if(vm.compressed) {
        vm.data = TableService.compressData(vm.data)
      } else {
        filterResultsByDateRange();
      }
    }

    function validateRange() {
      if (vm.dateRange.start > vm.dateRange.end) {
        [vm.dateRange.start, vm.dateRange.end] = [
          vm.dateRange.end,
          vm.dateRange.start,
        ];
      }
      if(vm.compressed) return;
      filterResultsByDateRange();
    }

    function filterResultsByDateRange() {
      vm.data = MainService.getResults().filter((e) => {
        return e.date < vm.dateRange.end && e.date > vm.dateRange.start;
      });

      console.log(vm.data);
    }
  }
})();
