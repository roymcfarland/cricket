var adminCtrl = angular.module("adminCtrl", []);

adminCtrl.controller("adminController", function($location, $scope, $http) {

	// First screen for user authentication
	var user = Parse.User.current();
	if(!user) return $location.path("/");

	// For authenticated users
	this.username = user.getUsername();
	this.testMessage = "This is the admin user page."

});