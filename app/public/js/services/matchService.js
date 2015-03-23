var matchService = angular.module("matchService", []);

matchService.factory("Matches", function($http, $q, $location) {

	////////////////////////
	/////// AJAX GET ///////
	////////////////////////

	var deferred = $q.defer();

	$http.get("/api/matches")
		.success(function(response) {
			deferred.resolve(response);
		})
		.error(function(error) {
			deferred.reject(error);
			alert("Sorry - there was an error. Please try again.");
			$location.path("/dashboard/matches");
		});

	return deferred.promise;

});