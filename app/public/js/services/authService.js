var authService = angular.module("authService", [])

authService.factory("Auth", function() {

	var authFactory = Parse.User();
	var currentUser = Parse.User.current();

	authFactory.logIn("myname", "mypass") 
		success: {
			// Insert logic if success
			alert("Login successful.");
		}
		error: {
			// Insert logic if failure
			alert("Error: " + error.code + " " + error.message);
		};

	authFactory.logOut = function() {
		Parse.User.logOut();
	};

	authFactory.isLoggedIn = function() {
		if (currentUser) {
			// return true;
		} else {
			// return false;
			alert("Please login again. Error: " + error.code + " " + error.message);
			Parse.User.logOut();
			window.location.assign("/login");
		}
	};

	/*
	authFactory.getUser = function() {
		if (currentUser) {
			return $http.get("/");
		} else {
			return 
		}
	}
	*/

});
