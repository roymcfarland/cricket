angular.module("routerRoutes", ["ngRoute"])

.config(function($routeProvider, $locationProvider) {
	$routeProvider
/*
		// route for the home page
		.when("/", {
			templateUrl: "../views/pages/home.html",
			controller: "homeController",
			controllerAs: "home"
		})

		// route for the leaderboard
		.when("/leaderboard", {
			templateUrl: "../views/pages/leaderboard.html",
			controller: "leaderboardController",
			controllerAs: "leaderboard"
		})

		// route for trades
		.when("/trades", {
			templateUrl: "../views/pages/trades.html",
			controller: "tradesController",
			controllerAs: "trades"
		})

		// route for my score
		.when("/myscore", {
			templateUrl: "../views/pages/myscore.html",
			controller: "myScoreController",
			controllerAs: "myScore"
		})

		// route for rules
		.when("/rules", {
			templateUrl: "../views/pages/rules.html",
			controller: "rulesController",
			controllerAs: "rules"
		})

		// route for legal terms
		.when("/legal", {
			templateUrl: "../views/pages/legal.html",
			controller: "legalTermsController",
			controllerAs: "legalTerms"
		})

		// route for contact page
		.when("/contact", {
			templateUrl: "../views/pages/contact.html",
			controller: "contactInfoController",
			controllerAs: "contactInfo"
		})
*/
	// Set app to use "pretty" URLs with no #
	$locationProvider.html5Mode(true);

});