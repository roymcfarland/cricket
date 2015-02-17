var tradesCtrl = angular.module("tradesCtrl", []);

tradesCtrl.controller("tradesController", ["$location", function($location) {
	// Bind view-model
	var vm = this;

	// First check whether user is authenticated
	var user = Parse.User.current();
	if(!user) return $location.path("/");

	// For authenticated users
	vm.username = user.getUsername();
}]);