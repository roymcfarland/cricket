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

		/*
		console.log("leagueId: ", leagueId);
		console.log("leagueName: ", leagueName);
		console.log("leagueEntryFee: ", leagueEntryFee);
		console.log("user:", user);
		*/

		// AJAX POST //
		$http.post("/api/v1/leagues/" + leagueId + "?addUser=true", {user: user}, [])
			.success(function (res, status) {
				$scope.res1 = res;
				$scope.status = status;
				if (status == 200) {
					console.log("Congratulations! You have joined " + leagueName + ".");
					var userLeagueId = $scope.res1.objectId;
					var user = {
						sessionToken: vm.user._sessionToken,
						objectId: vm.user.id
					};
					// AJAX POST //
					$http.post("/api/v1/lineups", {UserLeagueId: userLeagueId, Locked: false, user: user}, [])
						.success(function (res, status) {
							$scope.res2 = res;
							$scope.status = status;
							if (status == 201) {
								console.log("res2.status:", status);
								console.log(typeof(res2));
								console.log("res2", res2)
								// var lineupId = res2;
								// $location.path("/dashboard/leagues/createLineup/lineup/" + lineupId + "/league/" + leagueId);
							}
						})
						.error(function (res, status) {
							$scope.res = res;
							$scope.status = status;
							if (status == 404) {
								console.log("Error 404");
							} else if (status == 428) {
								console.log("Error 428");
								console.log(typeof(res));
								console.log("error res:", res);
							}
						});

				}
			})
			.error(function (res, status) {
				$scope.res = res;
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
				}
			});

	};

});
