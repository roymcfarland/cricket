angular.module("appRouter", ["ngRoute"])

.config(function($routeProvider, $locationProvider) {
	$routeProvider

		// route for the home page
		.when("/dashboard", {
			templateUrl: "../views/dashboard.html",
			controller: "dashboardController",
			controllerAs: "dashboard"
		})

		// route when logout
		.when("/login", {
			templateUrl: "../views/login.html",
			controller: "loginController",
			controllerAs: "login"
		})

		// route for the leaderboard
		.when("/leaderboard", {
			templateUrl: "../views/leaderboard.html",
			controller: "leaderboardController",
			controllerAs: "leaderboard"
		})

		// route for my team dashboard
		.when("/myteam", {
			templateUrl: "../views/myteam.html",
			controller: "myTeamController",
			controllerAs: "myTeam"
		})

		// route for trades
		.when("/trades", {
			templateUrl: "../views/trades.html",
			controller: "tradesController",
			controllerAs: "trades"
		})

		// route for rules
		.when("/rules", {
			templateUrl: "../views/rules.html",
			controller: "rulesController",
			controllerAs: "rules"
		})

		// route for legal terms
		.when("/legal", {
			templateUrl: "../views/legal.html",
			controller: "legalTermsController",
			controllerAs: "legalTerms"
		})

		// route for contact page
		.when("/contact", {
			templateUrl: "../views/contact.html",
			controller: "contactInfoController",
			controllerAs: "contactInfo"
		})

	// Set app to use "pretty" URLs with no #
	$locationProvider.html5Mode(true);

});