var loginCtrl = angular.module("loginCtrl", []);

loginCtrl.controller("loginController", function() {
	// Bind view-model
	var vm = this;
	vm.heading = "Please login by using the form below!";
	vm.doLogin = function() {
		Parse.User.logIn(vm.loginData.username, vm.loginData.password)
			/*
			if (Parse.User.current()) {
				alert("Welcome back! You are now logged in!")
			} else {
				alert("Error: " + error.code + " " + error.message);
			};
			*/
	};
});

loginCtrl.controller("fcbkLoginController", function() {
	// Bind view-model
	var vm = this;
	vm.doLogin = function() {
		// Insert logic
	};
});