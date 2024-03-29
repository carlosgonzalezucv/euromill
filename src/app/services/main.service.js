(function() {
  'use strict';

  angular
    .module('inspinia')
    .service('MainService', MainService);

  MainService.$inject = ['$http', 'config', 'MainFactory'];
  function MainService($http, config, MainFactory) {
    //this.getResults = getResults;
    let self = this;
    
    const start2019 = new Date("01-01-2018").getTime();
    const query = `lb=${ start2019 }`;
    
    // Estructura de dato para almacenar lo que habia en la fila, antes de que una entrada se convirtiera en cero
    let beforeZero = []; 
    this._results = [];

    this.loadResults = () => MainFactory.results.get(query).then(r => this._results = r);
    this.getResults = (query) => !query ? this._results : typeof query === "function" ? this._results.filter(query) : [];
    this.getBeforeZero = () => beforeZero;

    this.getGlobalStats = getGlobalStats;
    this.getHistogram = getHistogram;
    this.computeMeanEvolution = computeMeanEvolution;
    this.updateData = updateData;
    this.feedBeforeZero = feedBeforeZero;    
    this.resetBeforeZero = resetBeforeZero;
    this.getResults = getResults;

    function getResults() {
      return self._results;
    }

    function updateData() {
      return (
        MainFactory.results.update()
          .then(MainFactory.results.get)
          .then(r => this._results = r)
      );
    }
    function resetBeforeZero() {
      beforeZero = [];
    }
    function feedBeforeZero(obj) {
      beforeZero.push(obj);
    }
    function getGlobalStats(vm) {

      var data = vm.results,
        results = data.map(e => e.results.slice(0,5)),
        stars = data.map(e => e.stars);

      var sum = results.map(e => e.reduce(add, 0)),
        avg = sum.map(e => e/5),
        max = results.map(e => Math.max.apply(null, e)),
        min = results.map(e => Math.min.apply(null, e)),
        max_sum = Math.max.apply(null, sum),
        min_sum = Math.min.apply(null, sum),
        global_hist = computeHistogram(results, 50),
        mod = results.map(e => e.map(f => f%vm.globalModule));

        
      return {sum, max_sum, min_sum, avg, max, min, global_hist, mod};

      function add (a,b) {
        return a+b;
      }
    }
    function getHistogram (data, max) {
      return computeHistogram(data, max);
    }
    function computeHistogram (data, max) {
      let arr = new Array(max + 1).fill(0),
        allData = [].concat.apply([], data).map(Math.floor);
        
      allData.forEach(function(elem) {
        arr[elem]++;
      });
      return arr;
    }
    function computeMeanEvolution(data) {
      return data.map((e,i) => {
        let muestra = data.slice(0,i+1),
          arith = muestra.reduce(add) / (i + 1),
          geo = Math.pow(muestra.reduce(mult,1), 1 / (i + 1));

        // Calculos para la armonica
        let harmonic = Math.pow(geo, muestra.length),
          totalProduct = muestra.reduce(mult, 1),
          arith2 = muestra.map(e => totalProduct/e).reduce(add) / (i+1);

        harmonic = harmonic / arith2;
        return {arith, geo, harmonic};
      });
    }
    function add(a,b) { return a+b; }
    function mult(a,b) { return a*b; }

  }
})();