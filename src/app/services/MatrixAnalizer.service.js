(function() {
  'use strict';

  angular.module('inspinia')
    .directive('rowAnalizer', rowAnalizer)
    .service('MatrixAnalizer', MatrixAnalizer);

  // Servicio
  MatrixAnalizer.$inject=["MainService"];
  function MatrixAnalizer(MainService){

    this.analizeRow = (row, date, {tab = "Analisis por fila", name}={}) => {
      // tfvis.visor().surfaceList.clear();

      const hist = MainService.getHistogram(row.map(Number), Math.max(...row.map(Number))).map((value, index) => ({index, value}));
      console.log("hist", hist)
      const tensor = tf.tensor1d(row.map(Number));
      const surface = tfvis.visor().surface({name: name || `Fecha: ${ moment(date).format("DD/MM/YYYY ") }`, tab: tab});  
      tfvis.render.barchart(surface, hist);
      tfvis.visor().setActiveTab(tab)
      tfvis.visor().open();
    };

  }

  // Directivas
  rowAnalizer.$inject=["MatrixAnalizer"];
  function rowAnalizer(MatrixAnalizer){
    return {
      restrict: 'A',
      scope: {
        rowData: "=",
        date: "="
      },
      link: (scope, elem, atrr) => {
        
        elem.bind('click', handleClick);

        function handleClick(e) {
          MatrixAnalizer.analizeRow(scope.rowData, scope.date);
        }
      }
    }
  }
})();
