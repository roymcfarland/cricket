angular.module("fantasyCricket", ["appRoutes", "userService", "registerService"])

// mainController for the ENTIRE site
.controller("indexController", function() {
	var vm = this;
	vm.topMessage = "Hello Cricket Fans!";
});
