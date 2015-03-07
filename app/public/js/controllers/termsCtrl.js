var termsCtrl = angular.module("termsCtrl", []);

termsCtrl.controller("termsController", function($location) {
	// Bind view-model
	var vm = this;

	vm.testMessage = "These are the legal terms of use.";
	
});