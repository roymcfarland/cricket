// Parse DB initialization call (Application ID, JavaScript key)
Parse.initialize("GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD", "tiAbB7WfaIdHr4RKfdDQ7FeeYBjDysL6lRI8oHzw");

	// Parse Test Script
	// var TestObject = Parse.Object.extend("TestObject");
	// var testObject = new TestObject();
	// testObject.save({foo: "bar"}).then(function(object) {
	//   alert("yay! it worked");
	// });

// ng-app="cricketDuel"
var cricketDuel = angular.module("cricketDuel", ["appRouter", "login", "register", "leaderboard"])

// indexController for the entire site
cricketDuel.controller("indexController", function() {
	// Bind view-model
	var vm = this;
	vm.topMessage = "Welcome to CricketDuel!";
});

cricketDuel.controller("loginController", function() {
	// Bind view-model
	var vm = this;
	/*
	ACTIVATE AFTER PARSE DB IS OPERATIONAL
	Parse.User.logIn("userame", "password", {
		success: function(user) {
			// Insert logic if login successful
		},
		error: function(user, error) {
			// Insert logic if login failed.
		}
	});
	*/
	vm.testMessage = "You are no longer signed in. Please login again!";
})

cricketDuel.controller("dashboardController", function() {
	// Bind view-model
	var vm = this;
	/* 
	ACTIVATE AFTER PARSE DB IS OPERATIONAL
	var currentUser = Parse.User.current();
	if (currentUser) {
		// Insert logic
		// vm.smallMessage = "Welcome " + {{ User.username }} + "! You are now logged in.";
	} else {
		// Insert logic
		alert("Please login again. Error: " + error.code + " " + error.message);
		Parse.User.logOut();
		window.location.assign("/login");
	}
	*/
	vm.testMessage = "This is a Game Player's dashboard.";
});

cricketDuel.controller("leaderboardController", function() {
	// Bind view-model
	var vm = this;
	/* 
	ACTIVATE AFTER PARSE DB IS OPERATIONAL
	var currentUser = Parse.User.current();
	if (currentUser) {
		// Insert logic
		// vm.smallMessage = "Welcome " + {{ User.username }} + "! This is the leaderboard.";
	} else {
		// Insert logic
		alert("Please login again. Error: " + error.code + " " + error.message);
		Parse.User.logOut();
		window.location.assign("/login");
	}
	*/
	vm.testMessage = "This is the leaderboard.";
});

cricketDuel.controller("myTeamController", function() {
	// Bind view-model
	var vm = this;
	/* 
	ACTIVATE AFTER PARSE DB IS OPERATIONAL
	var currentUser = Parse.User.current();
	if (currentUser) {
		// Insert logic
		// vm.smallMessage = "Welcome " + {{ User.username }} + "! This is your team dashboard.";
	} else {
		// Insert logic
		alert("Please login again. Error: " + error.code + " " + error.message);
		Parse.User.logOut();
		window.location.assign("/login");
	}
	*/
	vm.testMessage = "This is your team dashboard.";
});

cricketDuel.controller("tradesController", function() {
	// Bind view-model
	var vm = this;
	/* 
	ACTIVATE AFTER PARSE DB IS OPERATIONAL
	var currentUser = Parse.User.current();
	if (currentUser) {
		// Insert logic
		// vm.smallMessage = "Welcome " + {{ User.username }} + "! This is your trades page.";
	} else {
		// Insert logic
		alert("Please login again. Error: " + error.code + " " + error.message);
		Parse.User.logOut();
		window.location.assign("/login");
	}
	*/
	vm.testMessage = "These are your pending player trades.";
});

cricketDuel.controller("rulesController", function() {
	// Bind view-model
	var vm = this;
	/* 
	ACTIVATE AFTER PARSE DB IS OPERATIONAL
	var currentUser = Parse.User.current();
	if (currentUser) {
		// Insert logic
		// vm.smallMessage = "Welcome " + {{ User.username }} + "! These are the league rules.";
	} else {
		// Insert logic
		alert("Please login again. Error: " + error.code + " " + error.message);
		Parse.User.logOut();
		window.location.assign("/login");
	}
	*/
	vm.testMessage = "These are the league rules.";
});

cricketDuel.controller("legalTermsController", function() {
	// Bind view-model
	var vm = this;
	/* 
	ACTIVATE AFTER PARSE DB IS OPERATIONAL
	var currentUser = Parse.User.current();
	if (currentUser) {
		// Insert logic
		// vm.smallMessage = "Welcome " + {{ User.username }} + "! These are the legal terms of use.";
	} else {
		// Insert logic
		alert("Please login again. Error: " + error.code + " " + error.message);
		Parse.User.logOut();
		window.location.assign("/login");
	}
	*/
	vm.testMessage = "These are the legal terms of use.";
});

cricketDuel.controller("contactInfoController", function() {
	// Bind view-model
	var vm = this;
	/* 
	ACTIVATE AFTER PARSE DB IS OPERATIONAL
	var currentUser = Parse.User.current();
	if (currentUser) {
		// Insert logic
		// vm.smallMessage = "Welcome " + {{ User.username }} + "! This is the contact page.";
	} else {
		// Insert logic
		alert("Please login again. Error: " + error.code + " " + error.message);
		Parse.User.logOut();
		window.location.assign("/login");
	}
	*/
	vm.testMessage = "This is the contact page.";
});
