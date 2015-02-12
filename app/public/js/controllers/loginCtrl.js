var loginCtrl = angular.module("loginCtrl", []);

loginCtrl.controller("loginController", function() {
	// Bind view-model
	var vm = this;
	vm.testMessage = "Please login by using the form below!";
	vm.doLogin = function() {
		Parse.User.logIn(vm.loginData.username, vm.loginData.password)
			/*
			if (status == success) {
				window.location.assign("/views/dashboard.html");
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