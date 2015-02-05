angular.module("fantasyCricket", ["routerRoutes", "userService"])

// mainController for the ENTIRE site
.controller("mainController", function() {
	var vm = this;
	vm.bigMessage = "Hello World!";
});

// homeController for index.html
.controller("homeController", function() {
	var vm = this;
	vm.message = "This is the home page!";
});

// leaderboardController for leaderboard.html
controller("leaderboardController", function() {
	var vm = this;
	vm.message = "This is the leaderboard...";
});

// tradesController for trades.html
controller("tradesController", function() {
	var vm = this;
	vm.message = "These are the trades...";
});

// myScoreController for myscore.html
controller("myScoreController", function(){
	var vm = this;
	vm.message = "These are the user's points...";
});

// rulesController for rules.html
.controller("rulesController", function() {
	var vm = this;
	vm.message = "These are the rules!";
});

// legalController for legal.html
.controller("legalTermsController", function() {
	var vm = this;
	vm.message = "This is our legal text.";
});

// contactController for contact info
.controller("contactInfoController", function() {
	var vm = this;
	vm.message = "This is our contact info...";
});
