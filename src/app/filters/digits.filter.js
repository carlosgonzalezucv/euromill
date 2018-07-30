(function() {
	'use strict';

	angular.module('inspinia')
		.filter('digits', digits);

	function digits() {
		return function(input) {
			return Math.floor(input / 10) === 0 ? ('0' + input) : input;	
		}
	}
})();