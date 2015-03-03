var leagueService = angular.module("leagueService", []);

leagueService.factory("Leagues", function($http) {
	// Create object
	var myLeagues = {};
	// GET request for myleagues.json from server
	myLeagues.all = function() {
		return $http.get("/api/leagues");
	};
	return myLeagues;
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