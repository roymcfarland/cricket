var dashboardCtrl = angular.module("dashboardCtrl", []);

dashboardCtrl.controller("dashboardController", function($location, $scope, $http) {
	
	var vm = this;
	// console.log($scope);

	/////////////////////////////////
	////// USER AUTHENTICATION //////
	/////////////////////////////////
	
	vm.user = Parse.User.current();
	if(!vm.user) return $location.path("/");



	/////////////////////////////////
	/// ACQUIRE CURRENT USER INFO ///
	/////////////////////////////////
	vm.username = vm.user.getUsername();
	// console.log("vm.user: ", vm.user);
	vm.userId = vm.user.id;
	vm.userMoney = vm.user.attributes.Money;
	// console.log("vm.userMoney: ", vm.userMoney);



	/////////////////////////////////
	/////////// AJAX GET ////////////
	/////////////////////////////////
	/*
	$http.get("/api/leagues/:userId")
	.success(function(response) {
		$scope.userLeagues = response;
	})
	.error(function(error) {
		alert("Sorry - there was an error.Try again.");
		$location.path("/dashboard");
	});
	*/


	/////////////////////////////////
	///////////// ASIDE /////////////
	/////////////////////////////////
	$scope.aside = {
		"title": "Easter Egg",
		"content": "Testing Angular Strap!"
	};

});