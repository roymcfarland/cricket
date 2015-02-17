var loginCtrl = angular.module("loginCtrl", []);

loginCtrl.controller("loginController", function() {
	// Bind view-model
	var vm = this;
	vm.heading = "Please login by using the form below!";
	vm.doLogin = function() {
		Parse.User.logIn(vm.loginData.username, vm.loginData.password)
			.then(function(user) {
				alert("Congratulations! User login successful!");
				$window.location.href="/dashboard";
			}, function(error) {
				console.log("#####  Oops! There was an error!  #####");
			});
	};
});

loginCtrl.controller("fcbkLoginController", function() {
	// Bind view-model
	var vm = this;
	vm.doLogin = function() {
		// Insert logic
	};
});