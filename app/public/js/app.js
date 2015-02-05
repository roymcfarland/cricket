angular.module("routerApp", [])

// Controllers

// mainController for the ENTIRE site
.controller("mainController", function() {

	var vm = this;

	vm.bigMessage = "Hello World!";

});

// homeController for index.html
.controller("homeController", function() {

	var vm = this;

	vm.message = "This is the home page!";

});

// rulesController for rules.html
.controller("rulesController", function() {

	var vm = this;

	vm.message = "This is the rules page!"

});
