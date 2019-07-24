(function() {
	'use strict';

	angular.module('inspinia')
		.directive('resultView', resultView);

	function resultView() {
		return {
			restrict: 'E',
			templateUrl: '/app/directives/result-view/result-view.html',
			scope: {
        data: '=',
        className: '@'
			}
		}
	}
})();

(function() {
	'use strict';

	angular.module('inspinia')
		.directive('arrayView', arrayView);

	function arrayView() {
		return {
			restrict: 'E',
      template: `
        <div class="custom-bg p-xs m-xs" >
          <div class="font-italic" style="display: flex; justify-content: space-between">
            <span class="p-xs text-center" ng-repeat="num in array track by $index"> {{num | digits}} </span>
          </div>
        </div>
      `,
			scope: {
        array: '=',
        className: '@',
        title: "@",
        index: "="
			}
		}
	}
})();