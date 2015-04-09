var createLineupCtrl = angular.module("createLineupCtrl", []);

createLineupCtrl.controller("createLineupController", function($location, $scope, $http, $filter, $routeParams, Leagues, Players) {

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
	// console.log("lineupId:", lineupId);
	// console.log("leagueId:", leagueId);


	var currentLineup = [];

	// Establish cricketPlayerType minimums for user's lineup
	vm.numberOfBowlers = 3;
	vm.numberOfBatsmen = 3;
	vm.numberOfWicketKeepers = 1;

	// Establish user's balance for buying players for lineup
	// vm.beginningBalance = 10000000;



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

	console.log('Leagues:', Leagues.getOne);

	Leagues.getOne.then(function(data) {
		$scope.leagues = data;
		console.log("###:", $scope.leagues);
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

	};



	/////////////////////////////////
	////// addPlayerToTeam() ////////
	/////////////////////////////////
	
	$scope.addPlayerToTeam = function() {

		var selectedCricketPlayer = this.player;
		var findWhere = _.findWhere(currentLineup, {id: selectedCricketPlayer.objectId});
		if (findWhere) return alert("You have already added this player to your lineup.");
		
		var playerId = $scope.playerId;
		var playerName = $scope.playerName;
		var playerPosition = $scope.playerPosition;
		var playerTeam = $scope.playerTeam;
		var playerCost = $scope.playerCost;
		var user = {
			sessionToken: vm.user._sessionToken,
			objectId: vm.user.id
		};

		// VISUALLY ADD PLAYER TO USER'S LINEUP
		var Player = function(id, name, position, team, cost) {
			this.id = id;
			this.name = name;
			this.position = position;
			this.team = team;
			this.cost = cost;
		};
		
		var addPlayerToLineup = function() {
			
			var lineupPlayer = new Player (selectedCricketPlayer.objectId, selectedCricketPlayer.name, selectedCricketPlayer.CricketPlayerType.name, selectedCricketPlayer.team, selectedCricketPlayer.cost);

			$scope.lineupPlayer = lineupPlayer;
			currentLineup.push(lineupPlayer);



			if (selectedCricketPlayer.CricketPlayerType.name === "Bowler" && vm.numberOfBowlers > 0) {
				vm.numberOfBowlers --;
			} else if (selectedCricketPlayer.CricketPlayerType.name === "Batsman" && vm.numberOfBatsmen) {
				vm.numberOfBatsmen --;
			} else if (selectedCricketPlayer.CricketPlayerType.name === "Wicket Keeper" && vm.numberOfWicketKeepers > 0) {
				vm.numberOfWicketKeepers --;
			}

			$scope.currentLineup = currentLineup;
			return currentLineup;

		};

		addPlayerToLineup();

	};


	////////////////////////////////
	//// removePlayerFromTeam() ////
	////////////////////////////////
	
	$scope.removePlayerFromTeam = function() {
		var playerId = this.player.id;
		var playerName = $scope.lineupPlayer.name;
		var playerPosition = $scope.lineupPlayer.position;
		var playerTeam = $scope.lineupPlayer.team;
		var playerCost = $scope.lineupPlayer.cost;
		var user = {
			sessionToken: vm.user._sessionToken,
			objectId: vm.user.id
		};

		// VISUALLY REMOVE PLAYER FROM USER'S LINEUP
		var removePlayer = function() {
			for (var i=0; i < currentLineup.length; i++)
				if (currentLineup[i].id == playerId) {
					var removedPlayerPosition = currentLineup[i].position;
					// console.log(removedPlayerPosition);
					currentLineup.splice(i,1);
					if (removedPlayerPosition === "Bowler" && vm.numberOfBowlers < 3) {
						vm.numberOfBowlers ++;
					} else if (removedPlayerPosition === "Batsman" && vm.numberOfBatsmen < 3) {
						vm.numberOfBatsmen ++;
					} else if (removedPlayerPosition === "Wicket Keeper" && vm.numberOfWicketKeepers < 1) {
						vm.numberOfWicketKeepers ++;
					}
					break;
				}
			$scope.currentLineup = currentLineup;
		};
		removePlayer();
	};

	// console.log(typeof(lineup));
	// console.log("lineup array:", lineup);

});


