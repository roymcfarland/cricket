var mainCtrl = angular.module("mainCtrl", []);

mainCtrl.controller("mainController", function($rootScope, $location, Auth) {
	// Bind the view-model
	var vm = this;

	// Get info if a person is logged in
	vm.loggedIn = Auth.isLoggedIn();

	/*
	// Check to see if a user is logged in on every request
	$rootScope.$on("$routeChangeStart", function() {
		vm.loggedIn = Auth.isLoggedIn();
	});
	*/
	 // Login form
	 vm.doLogin = function() {
	 	// Call the Auth.login() function
	 	Auth.logIn(vm.loginData.username, vm.loginData.password)
	 	.success(function(data) {
	 		$location.path("/dashboard");
	 	});
	 };

	 vm.doLogout = function() {
	 	Auth.logOut();
	 	$location.path("/logout");
	 };
});