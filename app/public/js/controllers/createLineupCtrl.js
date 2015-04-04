var createLineupCtrl = angular.module("createLineupCtrl", []);

createLineupCtrl.controller("createLineupController", function($location, $scope, $http, $filter, $routeParams, Players) {

	/////////////////////////////////
	/////////// Variables ///////////
	/////////////////////////////////
	
	var vm = this;
	vm.user = Parse.User.current();
	vm.username = vm.user.getUsername();
	vm.userMoney = vm.user.attributes.Money;
	var leagueId = $routeParams.leagueId;
	var lineupId = $routeParams.lineupId;
	var user = Parse.User.current();
	var userId = user.id;
	var sessionToken = user._sessionToken;

	// console.log("$routeParams:", $routeParams);
	console.log("lineupId:", lineupId);
	console.log("leagueId:", leagueId);



	/////////////////////////////////
	//////// Initialization /////////
	/////////////////////////////////
	
	var init = function() {

		// Is the user logged in?
		if(!vm.user) return $location.path("/");

		// Is the user a member of this league?
		$http.get("/api/v1/userLeagues?leagueId=" + leagueId + "&userId=" + userId + "&sessionToken=" + sessionToken, {}, [])
			.success(function (res, status) {
				$scope.league = res;
				$scope.status = status;
				if (status == 200) {
					console.log("League membership confirmed!");
					// console.log("$scope.status:", $scope.status);
				}
			})
			.error(function (res, status) {
				$scope.res = res;
				$scope.status = status;
				if (status == 404) {
					console.log("Error 404");
				} else if (status == 428) {
					console.log(data);
					alert("Error: " + data.errors.leagueId[0] + " (428)");
					$location.path("/dashboard/leagues");
				} else {
					console.log("Error unknown");
				}
			});
	};

	init();



	/////////////////////////////////
	//// createLineupService.js /////
	/////////////////////////////////
	
	Players.then(function(data) {
		$scope.players = data;
	});



	/////////////////////////////////
	/////// createLineup.html ///////
	/////////////////////////////////

	$scope.selectPlayer = function(id, name, playerType, playerTeam) {
		$scope.playerId = id;
		$scope.playerName = name;
		$scope.playerType = playerType;
		$scope.playerTeam = playerTeam;

		console.log("You selected", $scope.playerName);

	};



	/////////////////////////////////
	////////// saveLineup() /////////
	/////////////////////////////////
	
	$scope.saveLineup = function() {

	};



	/////////////////////////////////
	////// addPlayerToTeam() ////////
	/////////////////////////////////
	
	$scope.addPlayerToTeam = function() {
		
		var cricketPlayerId = $scope.playerId;
		var playerName = $scope.playerName;
		var playerType = $scope.playerType;
		var playerTeam = $scope.playerTeam;
		var user = {
			sessionToken: vm.user._sessionToken,
			objectId: vm.user.id
		};

		console.log("user:", user);
		console.log("lineupId:", lineupId);
		console.log("cricketPlayerId:", cricketPlayerId);
		// console.log("playerName:", playerName);
		// console.log("playerType:", playerType);
		// console.log("playerTeam:", playerTeam);

		// AJAX POST //
		$http.post("/api/v1/lineupPlayers", {user: user, LineupID: lineupId, CricketPlayerID: cricketPlayerId}, [])
		.success(function (res, status) {
			$scope.res = res;
			$scope.status = status;
			if (status == 201) {
				// console.log("$scope.status:", $scope.status);
				// console.log("$scope.res:", $scope.res);
				var lineupPlayerId = $scope.res.objectId;
				console.log("lineupPlayerId:", lineupPlayerId);
				alert(playerName + " has been added to your team");
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
				console.log("Error unknown")
			}
		});

	};



	////////////////////////////////
	//// removePlayerFromTeam() ////
	////////////////////////////////
	
	$scope.removePlayerFromTeam = function() {
		var playerId = $scope.playerId;
		var playerName = $scope.playerName;
		var playerType = $scope.playerType;
		var playerTeam = $scope.playerTeam;

		console.log("playerId: ", playerId);
		console.log("playerName: ", playerName);
		console.log("playerType: ", playerType);
		console.log("playerTeam: ", playerTeam);

		// See BP comment in leaguesCtrl.js
		var user = {
			sessionToken: vm.user._sessionToken,
			objectId: vm.user.id
		}

		///// AJAX  ////


	};

});
