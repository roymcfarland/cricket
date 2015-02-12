var loginCtrl = angular.module("loginCtrl", []);

loginCtrl.controller("loginController", function() {
	// Bind view-model
	var vm = this;
	vm.testMessage = "Please login by using the form below!";
	vm.doLogin = function() {
		// Call Auth.login()
		Parse.User.logIn(vm.login.username, vm.login.password)
			success: {
				window.location.assign("/dashboard");
			}
			error: {
				alert("Error: " + error.code + " " + error.message);
			};

		// .success(function(data) {
			// $location.path("/dashboard");
		// });
	};
});

loginCtrl.controller("fcbkLoginController", function() {
	// Bind view-model
	var vm = this;
	vm.doLogin = function() {
		// Insert logic
	};
});