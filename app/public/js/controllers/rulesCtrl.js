var rulesCtrl = angular.module("rulesCtrl", []);

rulesCtrl.controller("rulesController", ["$location", "$scope", "$http", function($location, $scope, $http) {

	this.testMessage = "This is the rules page!"

	// GET request for rules.json from server
	$http.get("/api/rules")
	.success(function(response) {
		$scope.gameRules = response;
	})
	.error(function(error) {
		alert("Sorry - there was an error. Try again.");
		$location.path("/");
	});
	
}]);