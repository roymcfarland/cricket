var leaderboardCtrl = angular.module("leaderboardCtrl", []);

leaderboardCtrl.controller("leaderboardController", ["$location", function($location) {

	// First screen user authentication
	var user = Parse.User.current();
	if(!user) return $location.path("/");

	// For authenticated users
	this.username = user.getUsername();
	this.testMessage = "This is the leaderboard.";
	
}]);