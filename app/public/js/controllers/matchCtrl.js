var matchesCtrl = angular.module("matchesCtrl", []);

matchesCtrl.controller("matchesController", function($location, $scope, $http, $filter, ngTableParams, Matches) {

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
	// vm.userId = vm.user.id;
	vm.userMoney = vm.user.attributes.Money;
	// console.log("vm.userMoney: ", vm.user.attributes.Money);
	// console.log("vm.user: ", vm.user);
	


	/////////////////////////////////
	//////// matchService.js ////////
	/////////////////////////////////
	
	Matches.then(function(data) {
		$scope.matches = data;
	});



	/////////////////////////////////
	////////// matches.html /////////
	/////////////////////////////////

	$scope.matchId = null;

	$scope.selectId = function(id) {
		$scope.matchId = id;
	}


	/////////////////////////////////
	/////// createNewLineup() ///////
	/////////////////////////////////
	
	$scope.createNewLineup = function() {
		var matchId = $scope.matchId;
		console.log("matchId: ", matchId);
		
	};

});