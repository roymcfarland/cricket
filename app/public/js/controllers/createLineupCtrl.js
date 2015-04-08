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


	var lineup = [];



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

	$scope.selectPlayer = function(id, name, position, team, cost) {
		$scope.playerId = id;
		$scope.playerName = name;
		$scope.playerPosition = position;
		$scope.playerTeam = team;
		$scope.playerCost = cost;

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
		
		var playerId = $scope.playerId;
		var playerName = $scope.playerName;
		var playerPosition = $scope.playerPosition;
		var playerTeam = $scope.playerTeam;
		var playerCost = $scope.playerCost;
		var user = {
			sessionToken: vm.user._sessionToken,
			objectId: vm.user.id
		};

		// console.log("user:", user);
		// console.log("lineupId:", lineupId);
		console.log("playerId:", playerId);
		// console.log("playerCost:", playerCost);
		// console.log("playerName:", playerName);
		// console.log("playerType:", playerType);
		// console.log("playerTeam:", playerTeam);

		// AJAX POST
		$http.post("/api/v1/lineupPlayers", {user: user, LineupID: lineupId, CricketPlayerID: playerId}, [])
		.success(function (res, status) {
			$scope.res = res;
			$scope.status = status;
			if (status == 201) {
				// console.log("$scope.status:", $scope.status);
				// console.log("$scope.res:", $scope.res);
				var lineupPlayerId = $scope.res.objectId;
				console.log("lineupPlayerId:", lineupPlayerId);
				console.log(playerName + " has been added to your team");
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

		// VISUALLY ADD PLAYER TO USER'S LINEUP
		var Player = function(id, name, position, team, cost) {
			this.id = id;
			this.name = name;
			this.position = position;
			this.team = team;
			this.cost = cost;
		};
		
		var movePlayerToLineup = function() {
			var lineupPlayer = new Player (playerId, playerName, playerPosition, playerTeam, playerCost);
			// console.log(lineupPlayer);
			$scope.lineupPlayer = lineupPlayer;
			lineup.push(lineupPlayer);
			$scope.lineup = lineup;

			// Disable player in available players column
			console.log("playerId:", lineupPlayer.id);

			return lineup;

		};
		movePlayerToLineup();
		
		// Array of objects created for ng-repeat="player in lineup"
		console.log("###", lineup);

	};


	////////////////////////////////
	//// removePlayerFromTeam() ////
	////////////////////////////////
	
	$scope.removePlayerFromTeam = function() {
		var playerId = $scope.lineupPlayer.id;
		var playerName = $scope.lineupPlayer.name;
		var playerPosition = $scope.lineupPlayer.position;
		var playerTeam = $scope.lineupPlayer.team;
		var playerCost = $scope.lineupPlayer.cost;
		var user = {
			sessionToken: vm.user._sessionToken,
			objectId: vm.user.id
		};

		console.log("user:", user);
		console.log("playerId: ", playerId);
		console.log("playerName: ", playerName);
		console.log("playerPosition: ", playerPosition);
		console.log("playerTeam: ", playerTeam);
		console.log("playerCost:", playerCost);

		// VISUALLY REMOVE PLAYER FROM USER'S LINEUP
		console.log("####", lineup);
		
		var removePlayer = function() {
			console.log("playerId:", playerId);
			console.log("lineup[0].id", lineup[0].id);
			console.log("lineup[1].id", lineup[1].id);
			for (i=0; i < lineup.length; i++)
				if (lineup[i].id == playerId) {
					lineup.splice(i,1);
					break;
				}
		};
		removePlayer();
		console.log("####", lineup);

	};

	// console.log(typeof(lineup));
	// console.log("lineup array:", lineup);

});


