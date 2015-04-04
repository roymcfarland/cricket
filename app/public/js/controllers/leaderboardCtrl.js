var leaderboardCtrl = angular.module("leaderboardCtrl", []);

leaderboardCtrl.controller("leaderboardController", function($location, $scope, $http) {

	// First screen user authentication
	var user = Parse.User.current();
	if(!user) return $location.path("/");
	
});