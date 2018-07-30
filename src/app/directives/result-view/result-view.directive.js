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