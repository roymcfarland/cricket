var leaderboard = angular.module("leaderboardService", []);

leaderboard.factory("Leaderboard", function($http) {
	// Create object
	var myFactory = {};
	// GET request for leaderboard.json from server
	myFactory.all = function() {
		return $http.get("/api/leaderboard");
	};
	return myFactory;
});

/*
leaderboard.factory("Leaderboard", ["$location", "$scope", "$http", function($location, $scope, $http) {
	var thisFactory = {};
	thisFactory.all = function() {
		return $http.get("/api/leaderboard");
	};
	return thisFactory;
}]);
*/
