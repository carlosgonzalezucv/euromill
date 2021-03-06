(function () {
  'use strict';
  angular.module('inspinia')
    .controller('MainController', MainController);

  MainController.$inject = ["MainService", "$scope", "MatrixAnalizer"];
  function MainController(MainService, $scope, MatrixAnalizer) {

    var vm = this, { getGlobalStats, getResults } = MainService;
    vm.onLoadData = onLoadData;
    vm.loading = false;
    vm.updateResults = updateResults;
    vm.stats = {
      global: {}
    };
    vm.globalModule = 5;
    vm.column = 1;
    vm.cutIndex = { value: null, label: "Ninguno" };
    vm.cutIndexOptions = [
      {
        value: null,
        label: "Ninguno"
      },
      {
        value: 1,
        label: 1
      },
      {
        value: 2,
        label: 2
      },
      {
        value: 3,
        label: 3
      },
      {
        value: 5,
        label: 5
      },
      {
        value: 7,
        label: 7
      },
      {
        value: 15,
        label: 15
      }
    ];
    vm.showColumn = showColumn;
    vm.updateMod = updateMod;
    vm.updateControlDay = updateControlDay;
    vm.updateControlDayByTables = updateControlDayByTables;
    vm.showTsHist = showTsHist;
    vm.selectedAxes = '0,1,2';
    vm.formatter = digit => {
      return digit.toString().length === 1 ? `0${digit}` : digit.toString();
    };
    vm.mapToMod9 = array => array.map(e => e%9 || 9);

    start();

    function start() {
      _updateAll();
    }
    function onLoadData() {
    }
    function _updateAll() {
      vm.__results = getResults();
      vm.results2 = vm.__results.reverse();
      vm.results = vm.results2.map(({ results, date, stars }) => ({ results: [...results, ...stars], date: new Date(date) }));
      updateControlDay();
      updateControlDayByTables();
      vm.stats.global = getGlobalStats(vm);
      vm.onlyResults = vm.results2.map(e => [...e.results, ...e.stars]);
      vm.dates = vm.results2.map(e => e.date);
      showColumn(1);
    }
    function showColumn(column) {
      vm.column = column;
      vm.columnDetails = vm.results.map(e => e.results[vm.column - 1]);
    }
    function updateMod() {
      vm.stats.global = getGlobalStats(vm);
      showColumn(1);
    }
    function updateResults() {
      vm.loading = true;
      MainService.updateData($scope)
        .then(r => (vm.loading = false))
        .then(() => start())
        .catch(r => (vm.loading = false));
    }
    function computeAccumDays(results, resetIndex = null, size=50) {
      let computedDays = new Array(size).fill(0);
      let aux = [];
      MainService.resetBeforeZero();
      for (let currentIndex = 0; currentIndex < results.length; currentIndex++) {
        // console.log("resetIndex vs currentIndex", resetIndex, currentIndex);
        computedDays.forEach((elem, i) => {
          if (resetIndex && currentIndex % resetIndex === 0) {
            computedDays[i] = 1;
          } else {
            computedDays[i]++;
          }
        });
        results[currentIndex].forEach((e, i) => {
          currentIndex > 0 && MainService.feedBeforeZero({ number: e, value: computedDays[e - 1] - 1 });
          computedDays[e - 1] = 0;
        });
        aux.push(angular.copy(computedDays.map(vm.formatter)));
      }
      return aux;
    }
    function updateControlDay(index = null) {
      vm.loading = true;
      setTimeout(
        () => {
          vm.controlDay = computeAccumDays(vm.__results.map(({ results }) => results), index);
          vm.loading = false;
          $scope.$apply();
        },
        500
      );
    }
    function updateControlDayByTables(index = null) {
      vm.loading = true;
      setTimeout(
        () => {
          vm.controlDayByTables = computeAccumDays(vm.__results.map(({ results }) => results.map(e => e%9 || 9)), index, 9);
          vm.loading = false;
          console.log("vm.controlDayByTables", vm.controlDayByTables)
          $scope.$apply();
        },
        500
      );
    }
    function showTsHist() {
      let beforeZeroValues =  MainService.getBeforeZero().map(e => e.value);
      MatrixAnalizer.analizeRow(beforeZeroValues, new Date(), {tab: "BeforeZero", name: "Frecuencia de numeros antes del cero"});
    }
  }
})();