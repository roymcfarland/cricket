var indexCtrl = angular.module("indexCtrl", []);

indexCtrl.controller("indexController", ["$location", function($location) {
	// Bind view-model
	var vm = this;
	vm.topMessage = "Welcome to CricketDuel!";
}]);