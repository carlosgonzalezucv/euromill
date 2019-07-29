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

    function playWithSets ( currentIndex, Predictor ) {

      const OFFSET = 2, MAX_ITERATIONS = 6;
      const sum = (a,b) => (a + b) % 2;

      Predictor = Predictor || (
        (A,B) => ((A.product(A)).dotOperation(B.product(B), sum)).dotOperation([].randomBinary(MAX_SIZE_ARR), sum)
      );

      if (!__computed || !__computed.length) {
        throw new Error("__computed vacio. jodete");
      }


      let result = new Array(__computed.length - OFFSET);
      
      let orderedSequence = __computed.map(e => e.binaryArray[ currentIndex ]);
      
      for (let i = 0; i < result.length; i++) {
        let A = orderedSequence[ i ];
        let B = orderedSequence[ i + OFFSET - 1];
        let prediccion = Predictor(A,B);
        prediccion.setPrev( B );
        result[i] = [ prediccion ];
        let _next, _prev, _prediccion = prediccion;
        for (let j = 0; j < MAX_ITERATIONS; j ++) {
          _prev = _prediccion.getPrev();
          _next = _prediccion;
          _prediccion = Predictor(_prev, _next);
          result[i].push(
            _prediccion
          );
          _prediccion.setPrev( _next );
        }
      }
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
      let binaryArray = positions.map(e => e.toBinaryArray(MAX_SIZE_ARR));
      return {
        matrixBlocks,
        positions,
        numeritos,
        prevSort,
        nextSort,
        binaryArray
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



(function () {
  "use strict";

  angular.module("inspinia")
    .run(SetPrototypes);

  const MATRIX_SIZE = 4;
  const UNIT_MEASURE = 14;
    
  function SetPrototypes () {

    Array.prototype.toXY = function () {
      let self = this;

      return self.filter(e => e > -1).map(position => {
        let offsetY = Math.floor(position / MATRIX_SIZE);
        let offsetX = position % MATRIX_SIZE;

        return [offsetX * UNIT_MEASURE, offsetY * UNIT_MEASURE];
      });
    }

    Array.prototype.toMatrix4 = function () {
      let self = this;
      
      self = self.slice(0, 16);

      let Matrix = new Array( MATRIX_SIZE );

      for (let i = 0; i < MATRIX_SIZE; i++) {
        Matrix[ i ] = self.slice(i * MATRIX_SIZE, MATRIX_SIZE * (i + 1));
      }
      return Matrix;
    }

    Array.prototype.product = function ( vector ) {
      let self = this;

      let M1 = self.toMatrix4(),
        M2 = vector.toMatrix4().transpose();

      const product = (a,b) => a * b,
        sum = (a,b) => (a + b) % 2;

      if (M1.length !== M2.length) throw new Error("Dimension mismatch");

      return M1.map((row, index) => {
        return M2.map((column, index) => {
          return row.dotOperation(column, product).reduce(sum);
        });
      }).flat();
    }

    Array.prototype.randomBinary = function( size ) {
      return new Array( size ).fill( 0 ).map(() => Math.random()).map(Math.round);
    }

    Array.prototype.complement = function () {
      return this.map(e => e%2).map(e => 1-e);
    }

    Array.prototype.dotOperation = function ( vector, binaryOperation = (a,b) => ((a + b) % 2) ) {
      let self = this;

      if (vector.length !== self.length) throw new Error("Dimension mismatch");

      return self.map((e,i)=> binaryOperation(e, vector[ i ]));
    }

    Array.prototype.transpose = function () {
      let self = this;
      let firstRow = self[ 0 ];

      if (!firstRow || !firstRow.length || self.some(e => !e || e.length !== firstRow.length)) {
        throw new Error("Invalid matrix. Dimension mismatch.");
      }

      let aux = self.map((row, index) => {
        return self.map(e => e[ index ]);
      });

      return aux;
    }

    Array.prototype.toVector = function () {
      let self = this;
      return [].concat.apply([],self);
    }

    Array.prototype.getTransposedPositions = function () {      

      let self = this;
      let mapeo = new Array(16).fill(0).map((e,i) => i).toMatrix4().transpose().flat();

      return self.map(e => mapeo[e]);
    }

    Array.prototype.toBinaryArray = function (size) {
      
      let self = this,
        arr = new Array( size ).fill(0);

      self.filter(e => e > -1).forEach(pos => arr[ pos ] = 1);

      return arr;
    }

    Array.prototype.setPrev = function ( prev ) {
      this.prev = prev;
    }
    Array.prototype.getPrev = function () {
      return this.prev;
    }
    Array.prototype.setNext = function ( nxt ) {
      this.next = next;
    }
    Array.prototype.getNext = function () {
      return this.next;
    }

    function test () {
      let aux = new Array(16).fill(0).map((e,i) => i);

      let matrix = aux.toMatrix4();
      console.log("matrix", matrix);

      let transpose = matrix.transpose();
      console.log("transpose", transpose);

      let flattered = transpose.flat();
      console.log("flattered", flattered);

      let vector = transpose.toVector();
      console.log("vector", vector);

      let positions = [3,5,7,13];
      console.log("transposedPositions", positions.getTransposedPositions());
      console.log("BinaryArray", positions.toBinaryArray(16));
    }

    function test2 () {
      let M1 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
      let M2 = [2,0,0,0,0,2,0,0,0,0,2,0,0,0,0,2];

      console.log("producto", M1.product(M2));
      console.log("suma", M1.dotOperation(M2, (a,b) => a + b));
    }
    // test2();
  }
})();