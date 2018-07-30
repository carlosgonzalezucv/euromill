(function () {
  'use strict';
  angular.module('inspinia')
    .controller('MainController', MainController);

    MainController.$inject = ["MainService", "$scope"];
    function MainController(MainService, $scope) {

      var vm = this, {getGlobalStats, loadData, getResults} = MainService;      
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
        // Cargamos la data desde el servicio
        loadData($scope);
      }
      function onLoadData () {
        _updateAll();
      }
      function _updateAll () {
        vm.results2 = getResults().reverse();
        vm.results = vm.results2.map(({results, date, stars}) => ({results: [...results, ...stars], date: new Date(date)}))
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
          .catch(r => (vm.loading = false));
      }
    }
})();