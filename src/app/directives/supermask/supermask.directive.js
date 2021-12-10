(function () {
  "use strict";

  angular.module("inspinia").directive("supermask", supermask);

  function supermask() {
    return {
      restrict: "E",
      templateUrl: "/app/directives/supermask/supermask.template.html",
      scope: {
        data: "=",
      },
      controller: SupermaskController,
      controllerAs: "vm",
    };
  }

  SupermaskController.$inject = ["$scope"];
  function SupermaskController($scope) {
    let vm = this;
    vm.tables = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    vm.allDigits = [];
    vm.getDigitsFromTable = getDigitsFromTable;
    

    function getDigitsFromTable(mod) {
      if(mod === 9) mod = 0;
      return vm.allDigits.filter((e) => e % 9 === mod);
    }

    start();

    function start() {
      for (let i = 0; i < 50; i++) {
        vm.allDigits[i] = i+1;
      }
    }
  }
})();

(function () {})();
