var registerCtrl = angular.module("registerCtrl", []);

registerCtrl.controller("registerController", function() {
	// Bind view-model
	var vm = this;
	vm.heading = "Joining a league is easy! Use this form to open an account:"
	vm.doRegister = function() {
		
		// Create a new user
		var user = new Parse.User();

		// Configure new user
		user.set("email", vm.registerData.email);
		user.set("username", vm.registerData.username);
		user.set("password", vm.registerData.password);
		user.set("emailVerified", false);

		// Callback
		user.signUp(null, {
			success: function(user) {
				// Insert logic
			},
			error: function(user, error) {
				// Insert logic
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