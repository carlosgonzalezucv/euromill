(function () {
  "use strict";

  angular.module("inspinia").controller("TablesController", TablesController);

  TablesController.$inject = ["MainService", "LEGService"];
  function TablesController(MainService, LEGService) {
    let vm = this;

    vm.results = [];
    vm.dateRange = {
      start: new Date(Date.now() - 365 * 24 * 3600 * 1000),
      end: new Date(),
    };

    filterResultsByDateRange();

    vm.validateRange = validateRange;

    function validateRange() {
      if (vm.dateRange.start > vm.dateRange.end) {
        [vm.dateRange.start, vm.dateRange.end] = [
          vm.dateRange.end,
          vm.dateRange.start,
        ];
      }
      filterResultsByDateRange();
    }

    function filterResultsByDateRange() {
      vm.results = MainService.getResults().filter((e) => {
        return e.date < vm.dateRange.end && e.date > vm.dateRange.start;
      });

      console.log(vm.results);
    }
  }
})();
