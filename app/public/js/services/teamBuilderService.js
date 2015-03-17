var teamBuilderService = angular.module("teamBuilderService", []);

teamBuilderService.factory("Players", function($http, $q) {

	////////////////////////
	/////// AJAX GET ///////
	////////////////////////

	var deferred = $q.defer();

	$http.get("")

});