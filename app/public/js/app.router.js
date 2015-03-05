var appRouter = angular.module("appRouter", ["ngRoute"])

appRouter.config(function($routeProvider, $locationProvider) {
	$routeProvider

		// route to game player's unique dashboard
		.when("/dashboard", {
			templateUrl: "../views/dashboard.html",
			controller: "dashboardController",
			controllerAs: "dashboard"
		})

		// route for admin managment
		.when("/admin", {
			templateUrl: "../views/admin.html",
			controller: "adminController",
			controllerAs: "admin"
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
		.when("/rules", {
			templateUrl: "../views/rules.html",
			controller: "rulesController",
			controllerAs: "rules"
		})

		// route for legal terms
		.when("/legal", {
			templateUrl: "../views/terms.html",
			controller: "termsController",
			controllerAs: "terms"
		})

		// route for contact page
		.when("/contact", {
			templateUrl: "../views/contact.html",
			controller: "contactController",
			controllerAs: "contact"
		})

		// route for leagues page
		.when("/leagues", {
			templateUrl: "../views/leagues.html",
			controller: "leaguesController",
			controllerAs: "leagues"
		})

		// catch all route
		.otherwise({
			redirectTo: "/"
		});

	// Remove # for html5 browsers
	$locationProvider.html5Mode(true);

});