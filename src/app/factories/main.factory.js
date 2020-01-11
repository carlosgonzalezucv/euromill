(function() {
  'use strict';

  angular
    .module('inspinia')
    .factory('MainFactory', MainFactory);

  MainFactory.$inject = ['$http', 'config'];
  function MainFactory($http, config) {

    let base = config().url;
    const service = {
      results: {
        get: getResults,
        update: updateResults
      }
    };
    
    return service;

    function getResults(query) {
      let route = base + '/v1/results';
      if (query) {
        route += ('?' + query);
      }
      return $http.get(route).then(complete);
    }

    function updateResults(query) {
      let route = base + '/v1/storeresults';
      return $http.get(route).then(complete);
    }    

    function complete(res) {
      return res.data.message;
    }
  }
})();