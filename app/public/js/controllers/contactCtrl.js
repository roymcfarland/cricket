var contactCtrl = angular.module("contactCtrl", []);

contactCtrl.controller("contactController", function($location) {
	// Bind view-model
	var vm = this;

	vm.testMessage = "This is the contact page.";
});