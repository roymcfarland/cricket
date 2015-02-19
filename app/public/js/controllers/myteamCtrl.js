var myteamCtrl = angular.module("myteamCtrl", []);

myteamCtrl.controller("myteamController", ["$location", "$scope", "$http", function($location, $scope, $http){

	// First check user authentication
	var user = Parse.User.current();
	if(!user) return $location.path("/");

	// For authenticated users
	this.username = user.getUsername();

	/*
	// GET request for myteam.json from server
	$http.get("/api/myteam")
	.success(function(response) {
		$scope.myteam = response;
	})
	.error(function(error) {
		alert("Sorry - there was an error. Try again.");
		$location.path("/");
	});
	*/
	
}]);