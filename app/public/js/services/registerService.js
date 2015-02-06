var registerService = angular.module("registerService", [])

registerService.factory("Register", function() {

	// Create a new subclass of Parse.Object
	var NewUser = Parse.Object.extend("User");

	// Create a new instance of that class
	var newUser = new NewUser();

	newUser.set("email", 00001);
	newUser.set("username", 00002);
	newUser.set("password", 00003);
	newUser.set("_id", 00004);

	newUser.save(null, {
		success: function(newUser) {
			// Insert logic that should happen if save succeeds
			alert("New Parse.Object.User created with objectId: " + newUser.id);
		},
		error: function(newUser, error) {
			// Insert logic that should happen if save fails
			alert("Failed to create new Parse.Object.User. Error code: " + error.message);
		}
	});



});