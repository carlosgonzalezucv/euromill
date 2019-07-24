(function () {
  'use strict';

  angular
    .module('inspinia')
    .service('LEGService', LEGService);

  const MAX_SIZE_ARR = 16; // Matriz 4x4
  const MAGIC_JUMP = 7; // Salto magico
  const DEF_MODULUS = 50; // Modulo 50
  const SortNumbers = asc => (a, b) => asc * (a - b) / Math.abs(a - b);

  LEGService.$inject = ["SetOperations"];

  function LEGService(SetOperations) {

    let __computed;
    this.computeLeg = computeLeg;
    this.tresMatrices = tresMatrices;
    this.getNumbersAtPositions = getNumbersAtPositions;
    this.playWithSets = playWithSets;

    function playWithSets ( op, currentIndex ) {

      const OFFSET = 2;

      if (!__computed || !__computed.length) {
        throw new Error("__computed vacio. jodete");
      }

      if (!SetOperations[ op ]) {
        throw new Error("Operacion invalida. jodete");
      }

      let result = new Array(__computed.length - OFFSET);
      let setOperation = SetOperations[ op ];

      let arrayOfSets = __computed.map(e => e.positions[ currentIndex ]).map(set => {
        let avoidNegative = set.filter(e => e > -1);
        return new Set( avoidNegative );
      });

      // console.log(arrayOfSets.slice(0,2));

      for (let i = 0; i < result.length; i++) {
        result[i] = setOperation( arrayOfSets[ i ], arrayOfSets[ i + OFFSET - 1] );
      }

      // console.log("Operacion", result[0]);

      return result;
    }

    /** 
     * Calcula las posiciones del resultado nuevo en 
     * las matrices generadas por el resultado anterior 
     * de todos los resultados existentes 
     * */
    function computeLeg(base) {
      // base son todos los sorteos en un arreglo de arreglos.
      let result = new Array(base.length - 1);
      let t = Date.now();
      for (let i = 0; i < base.length - 1; i++) {
        result[i] = Train(base[i], base[i + 1]);
      }
      console.log("Tiempo transcurrido para hacer los calculos: %d ms", Date.now() - t);
      
      return (__computed = result);
    }

    /** Calcula las posiciones y los numeritos asociados a dos sorteos consecutivos */
    function Train(prevSort, nextSort) {
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
    function tresMatrices(digit) {
      let iterationsArray = [digit, clase(digit + 12), clase(digit + 24)];
      return iterationsArray.map(_builder);

      function _builder(d) {
        return new Array(MAX_SIZE_ARR).fill(0)
          .map((e, index) => d + (index * MAGIC_JUMP))
          .map(clase);
      }
    }

    function clase(d) {
      return d % DEF_MODULUS || DEF_MODULUS;
    }

    function findPositions(nextSort, baseArray) {
      return baseArray.map(array => {
        let positions = nextSort.map(r => array.indexOf(r)).filter(e => e > -1);
        return positions;
      });
    }

    function getNumbersAtPositions(arr, positions) {
      return arr.map(row => {
        return row.filter((e, i) => positions.includes(i));
      });
    }
  }
})();

(function () {
  angular.module("inspinia")
    .service("SetOperations", SetOperations);

  function SetOperations() {

    this.isSuperset = isSuperset;
    this.union = union;
    this.intersection = intersection;
    this.symmetricDifference = symmetricDifference;
    this.difference = difference;

    function isSuperset(set, subset) {
      for (var elem of subset) {
        if (!set.has(elem)) {
          return false;
        }
      }
      return true;
    }

    function union(setA, setB) {
      var _union = new Set(setA);
      for (var elem of setB) {
        _union.add(elem);
      }
      return _union;
    }

    function intersection(setA, setB) {
      var _intersection = new Set();
      for (var elem of setB) {
        if (setA.has(elem)) {
          _intersection.add(elem);
        }
      }
      return _intersection;
    }

    function symmetricDifference(setA, setB) {
      var _difference = new Set(setA);
      for (var elem of setB) {
        if (_difference.has(elem)) {
          _difference.delete(elem);
        } else {
          _difference.add(elem);
        }
      }
      return _difference;
    }

    function difference(setA, setB) {
      var _difference = new Set(setA);
      for (var elem of setB) {
        _difference.delete(elem);
      }
      return _difference;
    }

  }
})();