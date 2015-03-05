var leaguesService = angular.module("leaguesService", []);

leaguesService.factory("Leagues", function($http) {
	// Create object
	var leagues = {};
	// GET request for myleagues.json from server
	leagues.all = function() {
		return $http.get("/api/leagues");
	};
	return leagues;
});

/*
leagueService.factory("Leagues", ["$location", "$scope", "$http", function($location, $scope, $http) {
	var thisFactory = {};
	thisFactory.all = function() {
		return $http.get("/api/leagues");
	};
	return thisFactory;
}]);
*/