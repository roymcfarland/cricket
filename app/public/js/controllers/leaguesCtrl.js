var leaguesCtrl = angular.module("leaguesCtrl", []);

dashboardCtrl.controller("leaguesController", [ "$location", "$scope", "$http", function($location, $scope, $http) {
	
	// First screen for user authentication
	var user = Parse.User.current();
	if(!user) return $location.path("/");

	// For authenticated users
	this.username = user.getUsername();
	this.testMessage = "This is the page where you can join a league. Coming soon!";

	// GET request for rules.json from server
	$http.get("/api/leagues")
	.success(function(response) {
		$scope.leagues = response;
	})
	.error(function(error) {
		alert("Sorry - there was an error. Try again.");
		$location.path("/");
	});

}]);