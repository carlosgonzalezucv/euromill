(function () {
  'use strict';

  angular
    .module('inspinia')
    .controller('GroupsController', GroupsController);

  const SortNumbers = asc => (a, b) => asc * (a - b) / Math.abs(a - b);
  const OPERATION = "symmetricDifference";
  const MAX_MATRIX_SIZE = 16;

  GroupsController.$inject = ['MainService', 'LEGService'];

  function GroupsController(MainService, LEGService) {
    let vm = this;
    vm.selectedIndex = 0;
    vm.showSetOperation = true;
    vm.operation = OPERATION;

    vm.data = LEGService.computeLeg(MainService._results.map(e => e.results));
    vm.onChangeIndex = onChangeIndex;
    vm.onOperationChange = onOperationChange;

    let PredictorList = {
      test,
      cuadratic,
      cubic
    };
    vm.predictor = "test";

    let prediction = LEGService.playWithSets(vm.selectedIndex, PredictorList[vm.predictor]);
    formatData(vm.data);
    addSetOperation(vm.data);

    console.log(prediction.length, vm.data.length);
    console.log("data", vm.data);

    function formatData(data) {
      data.forEach(doc => {
        doc.positions.forEach(row => {
          while (row.length < 5) {
            row.push(-1);
          }
          row = row.sort(SortNumbers(1));
        });

        doc.flatNumeros = doc.numeritos.map(numeritos => numeritos.flat());
      });
    }

    function addSetOperation(data) {
      data.forEach((doc, index) => {
        if (index > 1) {
          doc.SetOperation = prediction[index - 2];          
        }
      });
    }

    function onChangeIndex() {
      console.log("epa", vm.predictor, PredictorList[vm.predictor]);
      prediction = LEGService.playWithSets(vm.selectedIndex, PredictorList[vm.predictor]);
      addSetOperation(vm.data);
    }

    function onOperationChange() {
      onChangeIndex();
    }

    // Predictores

    function test (A, B) {
      const op = Math.max;
      return (A.dotOperation(B, op)).complement().dotOperation([].randomBinary( MAX_MATRIX_SIZE ))
    }

    function cuadratic (A, B) {
      return (A.product(A)).dotOperation(B.product(B)).dotOperation(A.product(B)).dotOperation(A.product(B));
    }
    function cubic (A, B) {
      return (A.product(A).product(A)).dotOperation(B.product(B));
    }
  }
})();