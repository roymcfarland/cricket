var indexCtrl = angular.module("indexCtrl", []);

indexCtrl.controller("indexController", function($location, $scope, $http) {
	
	this.topMessage = "Welcome to CricketDuel!";

	this.doLogout = function() {
		Parse.User.logOut();
		$location.path("/");
	};

	this.loginCheck = function() {
		if (Parse.User.current() == null) {
			return false;
		} else {
			return true;
		}
	};

	this.logoutCheck = function() {
		if (Parse.User.current() == null) {
			return true;
		} else {
			return false;
		}
	};
	
});