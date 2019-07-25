(function () {
  'use strict';

  angular
    .module('inspinia')
    .controller('GroupsController', GroupsController);

  const SortNumbers = asc => (a, b) => asc * (a - b) / Math.abs(a - b);
  const OPERATION = "symmetricDifference";

  GroupsController.$inject = ['MainService', 'LEGService'];

  function GroupsController(MainService, LEGService) {
    let vm = this;
    vm.selectedIndex = 0;
    vm.showSetOperation = true;
    vm.operation = OPERATION;

    vm.data = LEGService.computeLeg(MainService._results.map(e => e.results));
    vm.onChangeIndex = onChangeIndex;
    vm.onOperationChange = onOperationChange;

    let [aux, colors] = LEGService.playWithSets(vm.operation, vm.selectedIndex);
    formatData(vm.data);
    addSetOperation(vm.data);

    console.log(aux.length, vm.data.length);
    console.log("data", vm.data);

    function formatData(data) {
      data.forEach(doc => {
        doc.positions.forEach(row => {
          while (row.length < 5) {
            row.push(-1);
          }
          row = row.sort(SortNumbers(1));
        });

        doc.coordinates = doc.positions.map(row => row.toXY());
        doc.flatNumeros = doc.numeritos.map(numeritos => numeritos.flat());
      });
    }

    function addSetOperation(data) {
      data.forEach((doc, index) => {
        if (index > 1) {
          doc.SetOperation = [...aux[index - 2]].toXY();
          doc.Colors = colors[index - 2];
        }
      });
    }

    function onChangeIndex() {
      [aux, colors] = LEGService.playWithSets(vm.operation, vm.selectedIndex);
      addSetOperation(vm.data);
    }

    function onOperationChange() {
      onChangeIndex();
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
    }

    test();
  }
})();