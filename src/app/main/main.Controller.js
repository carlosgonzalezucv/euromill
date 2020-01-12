(function () {
  'use strict';
  angular.module('inspinia')
    .controller('MainController', MainController);

    MainController.$inject = ["MainService", "$scope"];
    function MainController(MainService, $scope) {

      var vm = this, {getGlobalStats, getResults} = MainService;
      vm.onLoadData = onLoadData;
      vm.loading = false;
      vm.updateResults = updateResults;
      vm.stats = {
        global: {}
      };
      vm.globalModule = 5;
      vm.column = 1;
      vm.showColumn = showColumn;
      vm.updateMod = updateMod;
      vm.selectedAxes = '0,1,2';

      start();

      function start() {
        _updateAll();
      }
      function onLoadData () {
      }
      function _updateAll () {
        vm.results2 = getResults().reverse();
        vm.results = vm.results2.map(({results, date, stars}) => ({results: [...results, ...stars], date: new Date(date)}))
        vm.controlDay = computeAccumDays(vm.results2.map(({results}) => results));
        vm.stats.global = getGlobalStats(vm);
        vm.onlyResults = vm.results2.map(e => [...e.results, ...e.stars]);
        vm.dates = vm.results2.map(e => e.date);
        showColumn(1);
      }
      function showColumn(column) {
        vm.column = column;
        vm.columnDetails = vm.results.map(e=> e.results[vm.column-1]);
      }
      function updateMod() {
        vm.stats.global = getGlobalStats(vm);
        showColumn(1);
      }
      function updateResults () {
        vm.loading = true;
        MainService.updateData($scope)
          .then(r => (vm.loading = false))
          .then(() => start())
          .catch(r => (vm.loading = false));
      }
      function computeAccumDays(results) {
        let computedDays = new Array(50).fill(0);
        let aux = [];
        for(let currentIndex = 0; currentIndex < results.length; currentIndex++) {
          computedDays.forEach((elem, i) => computedDays[i]++);
          results[currentIndex].forEach((e,i) => computedDays[e - 1] = 0);
          aux.push(angular.copy(computedDays));
        }
        console.log("aux", aux);
      }
    }
})();