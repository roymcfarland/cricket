var register = angular.module("register", [])

register.factory("Register", function() {

	// Create a new user
	var user = new Parse.User();

	// Configure new user
	user.set("email", "test@example.com");
	user.set("username", "test");
	user.set("password", "test");
	user.set("emailVerified", false);

	// Callback
	user.signUp(null, {
		success: function(user) {
			// Insert logic if success
			console.log("New user successfully created.")
		},
		error: function(user, error) {
			// Insert logic if error
			alert("Error: " + error.code + " " + error.message);
		}
	});
});
