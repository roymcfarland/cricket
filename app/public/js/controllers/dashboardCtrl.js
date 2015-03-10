var dashboardCtrl = angular.module("dashboardCtrl", []);

dashboardCtrl.controller("dashboardController", function($location, $scope, $http) {
	
	/////////////////////////////////
	////// USER AUTHENTICATION //////
	/////////////////////////////////
	var user = Parse.User.current();
	if(!user) return $location.path("/");


	/////////////////////////////////
	/// ACQUIRE CURRENT USER INFO ///
	/////////////////////////////////
	this.username = user.getUsername();
	// console.log(user);
	this.userId = user.id;
	this.userScore = user.attributes.totalScore;


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