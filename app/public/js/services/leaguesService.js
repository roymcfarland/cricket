var leaguesService = angular.module("leaguesService", []);

leaguesService.factory("Leagues", function($http, $q) {
	// // Create object
	// var leagues = {};
	// // GET request for myleagues.json from server
	// leagues.all = function() {
	// 	return $http.get("/api/leagues");
	// };
	// return leagues;


	////////////////////
	// WITH PROMISES //
	////////////////////

	var deferred = $q.defer();

	$http.get("/api/leagues")
		.success(function(response) {
			deferred.resolve(response);
		})
		.error(function(error) {
			alert("Sorry - there was an error. Try again.");
			deferred.reject(error);
			$location.path("/dashboard");
		});

	return deferred.promise;


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