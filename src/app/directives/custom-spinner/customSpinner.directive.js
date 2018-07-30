(function() {
  'use strict';

  angular
    .module('inspinia')
    .directive('customSpinner', customSpinner);

  customSpinner.$inject = [];
  function customSpinner () {
    var directive = {
      restrict: 'A',
      template: `      
        <div class="sk-spinner sk-spinner-three-bounce">
          <div class="sk-bounce1"></div>
          <div class="sk-bounce2"></div>
          <div class="sk-bounce3"></div>
        </div>
      `
    };
    return directive;
  }
})();