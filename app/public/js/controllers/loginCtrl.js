var loginCtrl = angular.module("loginCtrl", []);

loginCtrl.controller("loginController", function() {
	// Bind view-model
	var vm = this;
	vm.heading = "Please login by using the form below!";
	vm.doLogin = function() {
		var userPromise = Parse.User.logIn(vm.loginData.username, vm.loginData.password)
			.then(function(user){
				console.log('***logging user in***');
				console.log(typeof user);
			}, function(error){
				console.log('***error logging user in');
				console.log(error);
			});
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