var login = angular.module("login", [])

login.factory("Login", function() {

	Parse.User.logIn("myname", "mypass", {
		success: function(user) {
			// Insert logic if success
			console.log("Login successful.");
		},
		error: function(user, error) {
			// Insert logic if failure
			alert("Error: " + error.code + " " + error.message);
		}
	});

});