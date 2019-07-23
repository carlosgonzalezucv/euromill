(function() {
  'use strict';

  angular
    .module('inspinia')
    .service('LEGService', LEGService);

  const MAX_SIZE_ARR = 16; // Matriz 4x4
  const MAGIC_JUMP = 7; // Salto magico
  const DEF_MODULUS = 50; // Modulo 50
  const SortNumbers = asc => (a,b) => asc * (a-b) / Math.abs(a-b);

  LEGService.$inject = [];
  function LEGService() {

    this.computeLeg = computeLeg;
    this.tresMatrices = tresMatrices;
    this.getNumbersAtPositions = getNumbersAtPositions;
    
    /** 
     * Calcula las posiciones del resultado nuevo en 
     * las matrices generadas por el resultado anterior 
     * de todos los resultados existentes 
     * */
    function computeLeg(base) {
      // base son todos los sorteos en un arreglo de arreglos.
      let result = new Array(base.length - 1);
      let t = Date.now();
      for(let i=0; i<base.length - 1; i++) {
        result[i] = Train( base[i], base[i + 1] );
      }
      console.log("Tiempo transcurrido para hacer los calculos: %d ms", Date.now() - t);
      return result;
    }

    /** Calcula las posiciones y los numeritos asociados a dos sorteos consecutivos */
    function Train (prevSort, nextSort) {
      // prevSort = [7,	8,	32,	41,	49];
      // nextSort = [18,	23,	27,	42,	44];
      // 3 matrices por cada entrada del sorteo. En total son 15 matrices
      let matrixBlocks = prevSort.map(e => tresMatrices(e));
      let positions = matrixBlocks.map(matrix => [].concat.apply([], findPositions(nextSort, matrix)));
      let numeritos = matrixBlocks.map((matrix, index) => getNumbersAtPositions(matrix, positions[index]));
      return {
        matrixBlocks,
        positions,
        numeritos,
        prevSort,
        nextSort
      };
    }    
    
    /** Calcula las tres matrices asociadas a un digito */
    function tresMatrices (digit) {
      let iterationsArray = [ digit, clase(digit + 12), clase(digit + 24) ];
      return iterationsArray.map(_builder);
      
      function _builder (d) {
        return new Array(MAX_SIZE_ARR).fill(0)
        .map((e, index) => d + (index * MAGIC_JUMP))
        .map(clase);
      }
    }

    function clase (d) {
      return d % DEF_MODULUS || DEF_MODULUS;
    }

    function findPositions (nextSort, baseArray) {
      return baseArray.map(array => {
        let positions = nextSort.map(r => array.indexOf(r)).filter(e => e > -1);
        return positions;
      });
    }

    function getNumbersAtPositions (arr, positions) {
      return arr.map(row => {
        return row.filter((e,i) => positions.includes(i));
      });
    }
  }
})();