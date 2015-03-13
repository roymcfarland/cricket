var dashboardCtrl = angular.module("dashboardCtrl", []);

dashboardCtrl.controller("dashboardController", function($location, $scope, $http) {
	
	var vm = this;

	/////////////////////////////////
	////// USER AUTHENTICATION //////
	/////////////////////////////////
	var user = Parse.User.current();
	if(!user) return $location.path("/");


	/////////////////////////////////
	/// ACQUIRE CURRENT USER INFO ///
	/////////////////////////////////
	vm.username = user.getUsername();
	// console.log(user);
	vm.userId = user.id;
	vm.userScore = user.attributes.Money;


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