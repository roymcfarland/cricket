var registerCtrl = angular.module("registerCtrl", []);

registerCtrl.controller("registerController", function() {
	// Bind view-model
	var vm = this;
	vm.heading = "Joining a league is easy! Use this form to open an account:"
	vm.doRegister = function() {
		
		// CREATE NEW USER
		var user = new Parse.User();
		user.set("username", vm.registerData.username);
		user.set("password", vm.registerData.password);
		user.set("email", vm.registerData.email);
		// user.set("emailVerified", false);

		// REGISTER NEW USER
		user.signUp(null, {
			success: function(user) {
				// Insert logic
				alert("Congratulations! New user registration successful!")
			},
			error: function(user, error) {
				// Insert logic
				alert("Error: " + error.code + " " + error.message);
			}
		});
	};
});

registerCtrl.controller("fcbkRegisterController", function() {
	// Bind view-model
	var vm = this;
	vm.doRegister = function() {
		// Insert logic
	};
});