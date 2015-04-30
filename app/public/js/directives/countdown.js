var countdown = angular.module("countdown", []);

countdown.directive("countdown", function() {
	return {
		restrict: "E",
		templateUrl: "/../views/countdown.html"
	};
});
