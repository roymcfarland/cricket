var dashboardCtrl = angular.module("dashboardCtrl", []);

dashboardCtrl.controller("dashboardController", [ "$location", function($location) {
	// Bind view-model
	var vm = this;
	
	// First check user authentication
	var user = Parse.User.current();
	if(!user) return $location.path("/");

	// For authenticated users
	vm.username = user.getUsername();

}]);