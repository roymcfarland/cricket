angular.module("fantasyCricket", ["routerRoutes", "userService"])

// mainController for the ENTIRE site
.controller("mainController", function() {
	var vm = this;
	vm.topMessage = "Hello Cricket Fans!";
});
