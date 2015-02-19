var tradesCtrl = angular.module("tradesCtrl", []);

tradesCtrl.controller("tradesController", ["$location", "$scope", "$http", function($location, $scope, $http) {

	// First check whether user is authenticated
	var user = Parse.User.current();
	if(!user) return $location.path("/");

	// For authenticated users
	this.username = user.getUsername();

	/*
	// GET request for mytrades.json from server
	$http.get("/api/mytrades.json")
	.success(function(response) {
		$scope.mytrades = response;
	})
	.error(function(error) {
		alert("Sorry - there was an error. Try again.");
		$location.path("/");
	});
	*/

}]);