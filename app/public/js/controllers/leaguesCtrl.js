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

	Leagues.getAll.then(function(data) {
		$scope.leagues = data;
	});



	/////////////////////////////////
	////////// leagues.html /////////
	/////////////////////////////////

	$scope.selectLeague = function(id, name, entryFee) {
		$scope.leagueId = id;
		$scope.leagueName = name;
		$scope.leagueEntryFee = entryFee;

		// console.log("You selected", $scope.leagueName);

	};



	/////////////////////////////////
	/////// addUserToLeague() ///////
	/////////////////////////////////

	$scope.addUserToLeague = function() {

		var selectedLeague = this.league;
		var user = {
			sessionToken: vm.user._sessionToken,
			objectId: vm.user.id
		};


		// AJAX POST //
		$http.post("/api/v1/leagues/" + selectedLeague.objectId + "?addUser=true", {user: user})
			.success(function (res1, status) {
				if (status == 200) {
					alert(selectedLeague.name + " membership confirmed");
					var userLeagueId = res1.objectId;
					var user = {
						sessionToken: vm.user._sessionToken,
						objectId: vm.user.id
					};
					// AJAX POST //
					$http.post("/api/v1/lineups", {UserLeagueId: userLeagueId, Locked: false, user: user}, [])
						.success(function (res2, status) {
							if (status == 201) {
								var lineupId = res2.objectId;
								$location.path("/dashboard/leagues/createLineup/lineup/" + lineupId + "/league/" + $scope.leagueId);
							}
						})
						.error(function (res, status) {
							$scope.res = res;
							$scope.status = status;
							if (status == 404) {
								console.log("Error 404");
							} else if (status == 428) {
								console.log("Error 428");
								console.log("Error $scope.res:", $scope.res);
							} else if (status == 500) {
								console.log("Error 500");
								console.log("Error $scope.res:", $scope.res);
							} else if (status == 520) {
								console.log("Error 520");
								console.log("Error $scope.res:", $scope.res);
							} else {
								console.log("Error unknown");
							}
						});

				}
			})
			.error(function (res, status) {
				$scope.res = res;
				$scope.status = status;
				if (status == 404) {
					console.log("Error 404");
				} else if (status == 518) {
					alert("Sorry! This league is full. Please join another league. (Error 518)");
					$location.path("/dashboard/leagues");
				} else if (status == 519) {
					alert("You have already joined this league. Please join another. (Error 519)");
					$location.path("/dashboard/leagues");
				} else if (status == 500) {
					alert("Sorry! There was an error. Please try again. (Error 500)");
					$location.path("/dashboard/leagues");
				} else {
					console.log("Error unknown");
				}
			});

	};

});
