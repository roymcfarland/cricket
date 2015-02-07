var cricketDuel = angular.module("cricketDuel", ["appRouter", "login", "register"])

// indexController for the entire site
cricketDuel.controller("indexController", function() {
	var vm = this;
	vm.bigMessage = "Hello Cricket Fans!";

	/* 
	ACTIVATE AFTER PARSE DB IS OPERATIONAL
	var currentUser = Parse.User.current();
	if (currentUser) {
		// Insert logic
	} else {
		// Insert logic
		alert("Please login again. Error: " + error.code + " " + error.message);
		Parse.User.logOut();
	}
	*/
});

cricketDuel.controller("homeController", function() {
	// Bind view-model
	var vm = this;
	vm.smallMessage = "This is the home page.";

});