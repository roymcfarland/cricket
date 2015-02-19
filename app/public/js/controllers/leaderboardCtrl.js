var leaderboardCtrl = angular.module("leaderboardCtrl", []);

leaderboardCtrl.controller("leaderboardController", ["$location", "$scope", "$http", function($location, $scope, $http) {

	// First screen user authentication
	var user = Parse.User.current();
	if(!user) return $location.path("/");

	// For authenticated users
	this.username = user.getUsername();
	this.testMessage = "This is the leaderboard.";

	/*
	// GET request for leaderboard.json from server
	$http.get("/api/leaderboard")
	.success(function(response) {
		$scope.leaderboard = response;
	})
	.error(function(error) {
		alert("Sorry - there was an error. Try again.");
		$location.path("/");
	});
	*/
	
}]);