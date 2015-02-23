var indexCtrl = angular.module("indexCtrl", []);

indexCtrl.controller("indexController", ["$location", "$scope", "$http", function($location, $scope, $http) {
	
	this.topMessage = "Welcome to CricketDuel!";

	this.doLogout = function() {
		Parse.User.logOut();
		$location.path("/");
	};
	
}]);