var dashboardCtrl = angular.module("dashboardCtrl", []);

dashboardCtrl.controller("dashboardController", function($location, $scope, $http) {
	
	// First screen for user authentication
	var user = Parse.User.current();
	if(!user) return $location.path("/");

	// For authenticated users
	this.username = user.getUsername();
	this.testMessage = "This is the game player dashboard.";

	// Aside
	$scope.aside = {
		"title": "Easter Egg",
		"content": "Testing Angular Strap!"
	};

});