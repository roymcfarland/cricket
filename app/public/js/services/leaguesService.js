var leaguesService = angular.module("leaguesService", []);

leaguesService.factory("Leagues", function($http, $q, $location) {

	var getAll = (function() {
		var deferred = $q.defer();
		$http.get("/api/leagues")
			.success(function (response) {
				// TEMPORARY MOCKUP
				// console.log(response);
				response.forEach(function(league) {
					league.beginningBalance = 100000;
				});
				// console.log(response);
				deferred.resolve(response);
			})
			.error(function (error) {
				deferred.reject(error);
				alert("Sorry - there was an error. Please try again.");
				$location.path("/dashboard");
			});
		return deferred.promise;
	})();

	var getOne = (function() {
		var league = {
			// mock server data insert here
			beginningBalance: 100000000
		};
		return {
			then: function(cb){cb(league)}
		};
	})();

	return {
		getAll: getAll,
		getOne: getOne
	};

});
