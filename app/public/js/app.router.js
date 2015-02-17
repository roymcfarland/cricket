var appRouter = angular.module("appRouter", ["ngRoute"])

appRouter.config(function($routeProvider, $locationProvider) {
	$routeProvider

		// route to game player's unique dashboard
		.when("/dashboard", {
			templateUrl: "../views/dashboard.html",
			controller: "dashboardController",
			controllerAs: "dashboard"
		})

		// route for new user registration
		.when("/register", {
			templateUrl: "../views/register.html",
			controller: "registerController",
			controllerAs: "register"
		})

		// route for login
		.when("/login", {
			templateUrl: "../views/login.html",
			controller: "loginController",
			controllerAs: "login"
		})

		// route for logout
		.when("/logout", {
			templateUrl: "../views/logout.html",
			controller: "logoutController",
			controllerAs: "logout"
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
			controller: "myteamController",
			controllerAs: "myteam"
		})

		// route for trades
		.when("/trades", {
			templateUrl: "../views/trades.html",
			controller: "tradesController",
			controllerAs: "trades"
		})

		// route for rules
		.when("/api/rules", {
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

		// catch all router
		.otherwise({
			redirectTo: "/"
		});

	// Set app to use "pretty" URLs with no #
	$locationProvider.html5Mode(true);

});