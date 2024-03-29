(function() {
  'use strict';
  angular
    .module('inspinia')
    .config(routerConfig);
  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('index', {
        abstract: true,
        url: "/index",
        templateUrl: "app/components/common/content.html"
      })
      .state('index.main', {
        url: "/main",
        templateUrl: "app/main/main.html",
        data: { pageTitle: 'Example view' },
        controller: 'MainController',
        controllerAs: 'vm',
        resolve: {
          data: ["MainService", MainService => MainService.loadResults()] 
        }
      })
      .state('index.main.stats', {
        url: '/stats',
        templateUrl: 'app/main/stats/stats.html',
        data: { pageTitle: 'Estadísticas' }
      })
      .state('index.main.results', {
        url: '/results',
        templateUrl: 'app/main/results/results.html',
        data: { pageTitle: 'Resultados' }
      })
      .state('index.main.graphs', {
        url: '/graphs',
        templateUrl: 'app/main/graphs/graphs.html',
        data: { pageTitle: 'Gráficos' }
      })
      .state('index.main.groups', {
        url: '/groups',
        templateUrl: 'app/main/groups/groups.html',
        data: { pageTitle: 'Grupos' },
        controller: "GroupsController",
        controllerAs: "vm"
      })
      .state('index.main.thepower', {
        url: '/tables',
        templateUrl: 'app/main/tables/tables.html',
        data: { pageTitle: 'Tablas' },
        controller: "TablesController",
        controllerAs: "vm"
      })
    $urlRouterProvider.otherwise('/index/main');
  }
})();
