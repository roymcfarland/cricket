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
		var userLeagueId = "{{vm.user.leagueId}}"; // Come back and change this to atone for your sins!
		var matchId = $scope.matchId;
		var user = {
			sessionToken: vm.user._sessionToken,
			objectId: vm.user.id
		};
		console.log("userLeagueId: ", userLeagueId);
		console.log("matchId: ", matchId);
		console.log(user);

		/////////////////
		/// AJAX POST ///
		/////////////////
		$http.post("/api/v1/lineups", {UserLeagueId: userLeagueId, MatchId: matchId, Locked: false, user: user}, [])
		.success(function(data, status) {
			$scope.data = data;
			$scope.status = status;
		})
		
	};

});