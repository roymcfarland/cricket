var logoutCtrl = angular.module("logoutCtrl", []);

logoutCtrl.controller("logoutController", ['$location', function($location) {
	// Bind view-model
	var vm = this;
	vm.heading = "Click to logout"
	vm.doLogout = function() {
		Parse.User.logOut();
		$location.path("/");
	};
}]);

logoutCtrl.controller("fcbkLogoutController", function() {
	// Bind view-model
	var vm = this;
	vm.heading = "You have been logged out. Please login again!";
	vm.doLogout = function() {
		// Insert logic
	};
});