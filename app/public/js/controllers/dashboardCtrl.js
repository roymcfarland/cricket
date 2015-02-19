var dashboardCtrl = angular.module("dashboardCtrl", []);

dashboardCtrl.controller("dashboardController", [ "$location", "$scope", "$http", function($location, $scope, $http) {
	
	// First screen user authentication
	var user = Parse.User.current();
	if(!user) return $location.path("/");

	// For authenticated users
	this.username = user.getUsername();
	this.testMessage = "This is the game player dashboard."

	/*
	// GET request for dashboard.json from server
	$http.get("/api/dashboard")
	.success(function(response) {
		$scope.dashboard = response;
	})
	.error(function(error) {
		alert("Sorry - there was an error. Try again.");
		$location.path("/");
	});
	*/

}]);