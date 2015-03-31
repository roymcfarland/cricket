var leaguesCtrl = angular.module("leaguesCtrl", []);

leaguesCtrl.controller("leaguesController", function($location, $scope, $http, $filter, $routeParams, Leagues) {

	/////////////////////////////////
	/////////// Variables ///////////
	/////////////////////////////////
	
	var vm = this;
	vm.user = Parse.User.current();
	vm.username = vm.user.getUsername();
	vm.userMoney = vm.user.attributes.Money;
	var user = Parse.User.current();
	var userId = user.id;
	var sessionToken = user._sessionToken;



	/////////////////////////////////
	///////// Initialization ////////
	/////////////////////////////////
	
	var init = function() {

		// Is the user logged in?
		if(!vm.user) return $location.path("/");

	};

	init();



	/////////////////////////////////
	/////// leaguesService.js ///////
	/////////////////////////////////

	Leagues.then(function(data) {
		$scope.leagues = data;
	});



	/////////////////////////////////
	////////// leagues.html /////////
	/////////////////////////////////

	$scope.selectLeague = function(id, name, entryFee) {
		$scope.leagueId = id;
		$scope.leagueName = name;
		$scope.leagueEntryFee = entryFee;

		console.log("You selected", $scope.leagueName);

	};



	/////////////////////////////////
	/////// addUserToLeague() ///////
	/////////////////////////////////

	$scope.addUserToLeague = function() {

		var leagueId = $scope.leagueId;
		var leagueName = $scope.leagueName;
		var leagueEntryFee = $scope.leagueEntryFee;
		var user = {
			sessionToken: vm.user._sessionToken,
			objectId: vm.user.id
		};

		console.log("leagueId: ", leagueId);
		console.log("leagueName: ", leagueName);
		console.log("leagueEntryFee: ", leagueEntryFee);
		console.log("user:", user);

		// AJAX POST //
		$http.post("/api/v1/leagues/" + leagueId + "?addUser=true", {user: user}, [])
			.success(function(data, status) {
				$scope.data = data;
				$scope.status = status;
				if (status == 200) {
					alert("Congratulations! You have joined " + leagueName + ".");
					$location.path("/dashboard/leagues/createLineup/" + leagueId);
			}})
			.error(function(data, status) {
				$scope.data = data;
				$scope.status = status;
				if (status == 518) {
					alert("Sorry! This league is full. Please join another league. (Error 518)");
					$location.path("/dashboard/leagues");
				} else if (status == 519) {
					alert("You have already joined this league. Please join another. (Error 519)");
					$location.path("/dashboard/leagues");
				} else if (status == 500) {
					alert("Sorry! There was an error. Please try again. (Error 500)");
					$location.path("/dashboard/leagues");
			}});

	};
});
