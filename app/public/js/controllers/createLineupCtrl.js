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
					// console.log("League membership confirmed!");
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

		// Get the user's saved lineupPlayers
		$http.get("/api/v1/lineupPlayers?sessionToken=" + sessionToken, {})
			.success(function (allLineupPlayers, status) {
				if (status == 200) {
					// console.log("###:", res);
					// var allLineupPlayers = res;
					// console.log(allLineupPlayers);
					$scope.filteredLineup = allLineupPlayers.filter(function (el) {
						return el.LineupID.objectId == lineupId;
					});
				}
				// console.log("$scope.filteredLineup:", $scope.filteredLineup);

				$scope.currentLineup = $scope.filteredLineup.map(function (el) {
					return {
						id: el.CricketPlayerID.objectId,
						name: el.CricketPlayerID.name,
						position: el.CricketPlayerID.CricketPlayerTypeID.name,
						team: el.CricketPlayerID.team,
						cost: el.CricketPlayerID.cost
					};
				});
				// console.log("$scope.currentLineup:", $scope.currentLineup);
				for (var i = 0; i < $scope.currentLineup.length; i++) {
					if ($scope.currentLineup[i].position === "Bowler" && vm.numberOfBowlers > 0) {
						vm.numberOfBowlers --;
					} else if ($scope.currentLineup[i].position === "Batsman" && vm.numberOfBatsmen > 0) {
						vm.numberOfBatsmen --;
					} else if ($scope.currentLineup[i].postion === "Wicket Keeper" && vm.numberOfWicketKeepers > 0) {
						vm.numberOfWicketKeepers --;
					}
				}

				for (var i = 0; i < $scope.currentLineup.length; i ++) {
					$scope.currentBalance -= $scope.currentLineup[i].cost;
				}

			})
			.error(function (res, status) {
				if (status == 404) {
					console.log("Error 404");
				} else {
					console.log("Unknown Error");
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

	// console.log('Leagues:', Leagues.getOne);

	Leagues.getOne.then(function(data) {
		$scope.league = data;
		$scope.currentBalance = $scope.league.beginningBalance;
		// console.log("$scope.beginningBalance:", $scope.beginningBalance);
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

		// console.log("You selected", $scope.playerName);

	};



	/////////////////////////////////
	////////// saveLineup() /////////
	/////////////////////////////////
	
	// problemSaving array to push problems to
	$scope.problemSaving = [];

	$scope.recursiveSave = function(arr, errors) {
		if (arr.length == 0) return console.log("Save finished with " + errors + "number of errors.")

			var cricketPlayer = arr.pop();
			// console.log("###:", cricketPlayer.id);
			var payload = {
				user: user,
				LineupID: lineupId,
				CricketPlayerID: cricketPlayer.id
			};
			// AJAX POST
			$http.post("/api/v1/lineupPlayers", payload)
			.success(function (data, status) {
				if (status == 201) {
					console.log("### SAVED! ###");
					$scope.recursiveSave(arr, errors);
				}
			})
			.error(function (data, status) {
				console.log("### THERE WAS AN ERROR ###");
				$scope.problemSaving.push(cricketPlayer);
				$scope.recursiveSave(arr, errors++)
			})


	};

	$scope.saveLineup = function() {
		var currentLineupToSave = angular.copy($scope.currentLineup);
		// console.log("currentLineupToSave:", currentLineupToSave); 
		// if (currentLineupToSave == 0)
		$scope.recursiveSave(currentLineupToSave, 0);
	};

	/*
	function save(arr, errors) {
		// exit condition or errors is 3 exit out
		// 
		// 
		// try saving first player AJAX POST
		// if success, remove player from array and set errors to 0
		// if failr, increment errors
		// call save and pass array and errors
	};
	*/
	
/*
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

	*/



	/////////////////////////////////
	////// addPlayerToTeam() ////////
	/////////////////////////////////
	
	$scope.addPlayerToTeam = function() {

		var selectedCricketPlayer = this.player;
		var findWhere = _.findWhere($scope.currentLineup, {id: selectedCricketPlayer.objectId});
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
			$scope.currentLineup.push($scope.lineupPlayer);
			
			console.log("$scope.currentBalance:", $scope.currentBalance);
			var decrementBalance = function() {
				$scope.currentBalance -= selectedCricketPlayer.cost;
			}
			decrementBalance();
			console.log("$scope.currentBalance:", $scope.currentBalance);




			if (selectedCricketPlayer.CricketPlayerType.name === "Bowler" && vm.numberOfBowlers > 0) {
				vm.numberOfBowlers --;
			} else if (selectedCricketPlayer.CricketPlayerType.name === "Batsman" && vm.numberOfBatsmen) {
				vm.numberOfBatsmen --;
			} else if (selectedCricketPlayer.CricketPlayerType.name === "Wicket Keeper" && vm.numberOfWicketKeepers > 0) {
				vm.numberOfWicketKeepers --;
			}

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
			for (var i=0; i < $scope.currentLineup.length; i++)
				if ($scope.currentLineup[i].id == playerId) {
					var removedPlayerPosition = $scope.currentLineup[i].position;
					// console.log(removedPlayerPosition);
					$scope.currentLineup.splice(i,1);
					if (removedPlayerPosition === "Bowler" && vm.numberOfBowlers < 3) {
						vm.numberOfBowlers ++;
					} else if (removedPlayerPosition === "Batsman" && vm.numberOfBatsmen < 3) {
						vm.numberOfBatsmen ++;
					} else if (removedPlayerPosition === "Wicket Keeper" && vm.numberOfWicketKeepers < 1) {
						vm.numberOfWicketKeepers ++;
					}
					break;
				}
		};
		removePlayer();
	};

});
