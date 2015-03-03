var leaderboardCtrl = angular.module("leaderboardCtrl", []);

leaderboardCtrl.controller("leaderboardController", ["$location", "$scope", "$http", function($location, $scope, $http) {

	// First screen user authentication
	var user = Parse.User.current();
	if(!user) return $location.path("/");

	// For authenticated users
	this.username = user.getUsername();
	this.testMessage = "This is the leaderboard.";
	
	var vm = this;
	// GET leaderboard.json from logic in leaderboardService.js
	Leaderboard.all();
		// Promise object
		.success(function(data) {
			// Bind data to controller variable
			vm.leaderboard = data; // ?according to book?
			// $scope.leaderboard = data;
		})
		.error(function(error) {
			alert("Sorry - there was an error. Please try again!");
			$location.path("/");
		});

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