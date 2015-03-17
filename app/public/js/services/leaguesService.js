var leaguesService = angular.module("leaguesService", []);

leaguesService.factory("Leagues", function($http, $q, $location) {

	////////////////////////
	/////// AJAX GET ///////
	////////////////////////

	var deferred = $q.defer();

	$http.get("/api/leagues")
		.success(function(response) {
			deferred.resolve(response);
		})
		.error(function(error) {
			deferred.reject(error);
			alert("Sorry - there was an error. Please try again.");
			$location.path("/dashboard");
		});

	return deferred.promise;

});
