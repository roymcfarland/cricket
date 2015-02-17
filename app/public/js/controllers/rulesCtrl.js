var rulesCtrl = angular.module("rulesCtrl", []);

rulesCtrl.controller("rulesController", ["$location", function($location) {
	// Bind view-model
	var vm = this;

	vm.testMessage = "This is the rules page!"
	
}]);