angular.module("appRouter", ["ngRoute"])

.config(function($routeProvider, $locationProvider) {
	$routeProvider

		// route for the home page
		.when("/home", {
			templateUrl: "../views/pages/home.html",
			controller: "homeController",
			controllerAs: "home"
		})

		// route when logout
		.when("/login", {
			templateUrl: "../views/pages/login.html",
			controller: "loginController",
			controllerAs: "login"
		})

		// route for the leaderboard
		.when("/leaderboard", {
			templateUrl: "../views/pages/leaderboard.html",
			controller: "leaderboardController",
			controllerAs: "leaderboard"
		})

		// route for my team dashboard
		.when("/myteam", {
			templateUrl: "../views/pages/myteam.html",
			controller: "myTeamController",
			controllerAs: "myTeam"
		})

		// route for trades
		.when("/trades", {
			templateUrl: "../views/pages/trades.html",
			controller: "tradesController",
			controllerAs: "trades"
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

	// Set app to use "pretty" URLs with no #
	$locationProvider.html5Mode(true);

});