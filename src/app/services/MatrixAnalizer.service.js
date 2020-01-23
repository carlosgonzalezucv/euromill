(function() {
  'use strict';

  angular.module('inspinia')
    .directive('rowAnalizer', rowAnalizer)
    .service('MatrixAnalizer', MatrixAnalizer);

  function printHist(hist){
    const complete = d => d.toString().length > 1 ? d : `0${ d }`;
    hist.forEach((elem, index) => {
      console.log(`${index}:(${ complete(elem) }) ${ '*'.repeat(elem) }`);
    });
  }

  // Servicio
  MatrixAnalizer.$inject=["MainService"];
  function MatrixAnalizer(MainService){

    this.analizeRow = row => {
      let max = Math.max(...row.map(Number));
      console.log("Analizando fila");
      printHist(MainService.getHistogram(row.map(Number), max));

    };

  }

  // Directivas
  rowAnalizer.$inject=["MatrixAnalizer"];
  function rowAnalizer(MatrixAnalizer){
    return {
      restrict: 'A',
      scope: {
        rowData: "="
      },
      link: (scope, elem, atrr) => {
        
        elem.bind('click', handleClick);

        function handleClick(e) {
          MatrixAnalizer.analizeRow(scope.rowData);
        }
      }
    }
  }
})();
