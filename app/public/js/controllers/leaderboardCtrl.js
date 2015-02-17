var leaderboardCtrl = angular.module("leaderboardCtrl", []);

leaderboardCtrl.controller("leaderboardController", ["$location", function($location) {
	// Bind view-model
	var vm = this;

	vm.testMessage = "This is the leaderboard.";
	
}]);