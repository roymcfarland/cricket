////////////////////////////////////////////////////////////////
////////////////////////  PARSE DB  ////////////////////////////
////////////////////////////////////////////////////////////////

// Parse DB initialization call (Application ID, JavaScript key)
Parse.initialize("GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD", "tiAbB7WfaIdHr4RKfdDQ7FeeYBjDysL6lRI8oHzw");
	// Parse Test Script
	// var TestObject = Parse.Object.extend("TestObject");
	// var testObject = new TestObject();
	// testObject.save({foo: "bar"}).then(function(object) {
	//   alert("yay! it worked");
	// });

////////////////////////////////////////////////////////////////
////////////////////////  NG-APP  //////////////////////////////
////////////////////////////////////////////////////////////////

// ng-app="cricketDuel"
var cricketDuel = angular.module("cricketDuel", [
	"appRouter",
	"indexCtrl",
	"loginCtrl",
	"logoutCtrl",
	"registerCtrl",
	"dashboardCtrl",
	"myteamCtrl",
	"tradesCtrl"
]);

/////////////////////////////////////////////////////////////////
/////////////////////  NG-CONTROLLERS  //////////////////////////
/////////////////////////////////////////////////////////////////

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
