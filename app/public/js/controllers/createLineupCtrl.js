var createLineupCtrl = angular.module("createLineupCtrl", []);

createLineupCtrl.controller("createLineupController", function($location, $scope, $http, $filter, $routeParams, Leagues, Players) {

	/////////////////////////////////
	/////////// Variables ///////////
	/////////////////////////////////
	
	var vm = this;
	vm.user = Parse.User.current();
	vm.username = vm.user.getUsername();
	vm.userMoney = vm.user.attributes.Money;
	
	// store $routeParams
	// console.log("$routeParams:", $routeParams);
	var leagueId = $routeParams.leagueId;
	// console.log("leagueId:", leagueId);
	var lineupId = $routeParams.lineupId;
	// console.log("lineupId:", lineupId);
	
	var user = Parse.User.current();
	var userId = user.id;
	var sessionToken = user._sessionToken;
	
	// Array for adding/removing players (visually) to/from user's lineup on ng-click="addPlayerToTeam()" and ng-click="removePlayerFromTeam()"
	var currentLineup = [];
	
	// Setup cricketPlayerType minimums for user's lineup
	vm.numberOfBowlers = 3;
	vm.numberOfBatsmen = 3;
	vm.numberOfWicketKeepers = 1;

	// Keep track of all rounders who were added as batsmen or bowlers
	$scope.allroundersAsBatsmen = [];
	$scope.allroundersAsBowlers = [];
	
	// Array for players who need to be added or removed from DB on ng-click="saveLineup()"
	$scope.actionsQueue = [];



	/////////////////////////////////
	/////// Countdown Feature ///////
	/////////////////////////////////

	// jQuery countdown
    $(function () {
		var gameDay = new Date(2015, 6 - 1, 16);
		$('#defaultCountdown').countdown({
			until: gameDay,
			padZeroes: true, 
			format: 'yDHMS', 
			layout: '<ul>{y<}<li>{yn} {yl}</li>{y>}' + 
				'{d<}<li>{dnn} {dl}</li>{d>}{h<}<li>{hnn} {hl}</li>{h>}' + 
				'{m<}<li>{mnn} {ml}</li>{m>}{s<}<li>{snn} {sl}</li>{s>}</ul>'
		});
	});



	/////////////////////////////////
	//////// Initialization /////////
	/////////////////////////////////
	
	var init = function() {

		// Is the user logged in?
		if(!vm.user) return $location.path("/");

		// Get all lineupPlayers
		$http.get("/api/v1/lineupPlayers?lineupId=" + lineupId + "&userId=" + userId + "&sessionToken=" + sessionToken, {}, [])
			.success(function (res, status) {
				$scope.allLineupPlayers = res;
				// console.log("$scope.allLineupPlayers:", $scope.allLineupPlayers);
				
				// * * * //
				sortLineupsIntoMatches();
			

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
						// console.log("###:", el);
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
					} else if ($scope.currentLineup[i].position === "Wicket Keeper" && vm.numberOfWicketKeepers > 0) {
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
	//// sortLineupsIntoMatches /////
	/////////////////////////////////

	var sortLineupsIntoMatches = function() {

		$scope.matches = [{
			name: "Current Lineup",
			matchId: "", 
			lineupPlayers: []
		}];

		// Get matchId of lineupPlayer
		for (var i = 0; i < $scope.allLineupPlayers.length; i ++) {

			// If no matchId, add lineupPlayer to $scope.matches[0]
			if (!$scope.allLineupPlayers[i].LineupID.MatchID) {
				var lineupPlayer = $scope.allLineupPlayers[i].CricketPlayerID;
				// console.log("lineupPlayer[" + i + "]:", lineupPlayer);
				$scope.matches[0].lineupPlayers.push(lineupPlayer);
			}

			// If matchId but no matchId in $scope.matches, add lineupPlayer to $scope.matches and create matchId
			else if ($scope.allLineupPlayers[i].LineupID.MatchID) {
				var lineupPlayer = $scope.allLineupPlayers[i].CricketPlayerID;
				var matchId = $scope.allLineupPlayers[i].LineupID.MatchID;
				$scope.matches.push({
					name: "Past Lineup" + [$scope.matches.length],
					matchId: matchId,
					lineupPlayers: []
				});
				$scope.matches[$scope.matches.length].lineupPlayers.push(lineupPlayer);
			}

			// If matchId and matchId in $scope.matches, add lineupPlayer to $scope.matches under matchId
			else if ($scope.allLineupPlayers[i].LineupID.MatchID) {
				var lineupPlayer = $scope.allLineupPlayers[i].CricketPlayerID;

			}


		};

		$scope.currentSavedLineup = angular.copy($scope.matches);
		// console.log("$scope.currentSavedLineup:", $scope.currentSavedLineup);
		// console.log($scope.matches === $scope.currentSavedLineup);

	};



	///////////////////////////////////////
	// add cricketPlayer to actionsQueue //
	///////////////////////////////////////
	
	// type: "add"
	var addPlayerToActionsQueueTypeAdd = function(addedPlayer) {
		$scope.actionsQueue.push({
			type: "add",
			lineupPlayer: addedPlayer
		});
	};
	// type: "remove"
	var addPlayerToActionsQueueTypeRemove = function(removedPlayer) {
		// if player is not in currentSavedLineup, he only needs to be removed from visual representation of lineup (locally)
		// check first whether player is in currentSavedLineup. if yes, add to actionsQueue (type: "remove")

		// Prevent user from adding same player to lineup if player has already been added to $scope.currentLineup
		var findWhereInScopeCurrentSavedLineupLineupPlayers = _.findWhere($scope.currentSavedLineup[0].lineupPlayers, {objectId: removedPlayer.id});
		

		if (findWhereInScopeCurrentSavedLineupLineupPlayers) {
			// console.log("player pushed into actionsQueue (type: remove)");
			// push removedPlayer into actionsQueue - if applicable
			$scope.actionsQueue.push({
				type: "remove",
				lineupPlayer: removedPlayer
			})
		} else {
			// do not push removedPlayer into actionsQueue
			// console.log("addPlayerToActionsQueueTypeRemove() is not necessary. no add'l actions taken.");
		};

	};



	////////////////////////////////////////////
	// remove cricketPlayer from actionsQueue //
	////////////////////////////////////////////

	var removePlayerFromActionsQueue = function(removedPlayer) {
		for (var i=0; i < $scope.actionsQueue.length; i++) {
			if ($scope.actionsQueue[i].lineupPlayer.id == removedPlayer.id) {
				$scope.actionsQueue.splice(i,1);
			} else {
				// console.log("###");
			}
		}
	};



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

	$scope.selectPlayer = function(id, name, country, position, team, cost) {
		$scope.playerId = id;
		$scope.playerName = name;
		$scope.playerCountry = country;
		$scope.playerPosition = position;
		$scope.playerTeam = team;
		$scope.playerCost = cost;

		console.log($scope.playerCountry);
		// console.log("You selected", $scope.playerName);
		// console.log("$scope.currentSavedLineup:", $scope.currentSavedLineup);

	};



	/////////////////////////////////
	////////// saveLineup() /////////
	/////////////////////////////////
	
	// create function that loops thru actionsQueue and pushes players into new arrays by type - ADD || REMOVE
	$scope.problemProcessing = [];
	$scope.cricketPlayersToAdd = [];
	$scope.cricketPlayersToRemove = [];
	
	// recursive function to be called on event ng-click saveLineup() below
	$scope.processActionsQueue = function(arr, errors) {

		// break recursive logic after array is emptied
		if (arr.length == 0) return console.log("actionsQueue processed with " + errors + " number of errors.");
		
		// empty the actionsQueue array one player at a time
		var cricketPlayer = arr.pop();
		// console.log("###:", cricketPlayer.type);
		
		// push cricket players into array by type - ADD or REMOVE
		if (cricketPlayer.type == "add") {
			$scope.cricketPlayersToAdd.push(cricketPlayer);
			$scope.processActionsQueue(arr, errors);
		} else if (cricketPlayer.type == "remove") {
			$scope.cricketPlayersToRemove.push(cricketPlayer);
			$scope.processActionsQueue(arr, errors);
		};

		// see the results
		console.log("$scope.cricketPlayersToAdd:", $scope.cricketPlayersToAdd);
		console.log("$scope.cricketPlayersToRemove:", $scope.cricketPlayersToRemove);

	};


	// SAVE CRICKET PLAYER(S) TO LINEUP IN DATABASE //

	$scope.problemSaving = [];

	// recursiveSave to be called on event ng-click saveLineup() below
	$scope.recursiveSave = function(arr, errors) {
		if (arr.length == 0) return console.log("Save finished with " + errors + " number of errors.")

			var cricketPlayer = arr.pop();
			// console.log("###:", cricketPlayer.id);

			var payload = {
				user: user,
				LineupID: lineupId,
				CricketPlayerID: cricketPlayer.lineupPlayer.id
			};
			// AJAX POST
			$http.post("/api/v1/lineupPlayers", payload)
			.success(function (data, status) {
				if (status == 201) {
					console.log("### SAVED! ###");
					// * * * //
					$scope.recursiveSave(arr, errors);
				}
			})
			.error(function (data, status) {
				console.log("### THERE WAS AN ERROR ###");
				$scope.problemSaving.push(cricketPlayer);
				// * * * //
				$scope.recursiveSave(arr, errors++)
			})


	};


	// REMOVE CRICKET PLAYER(S) FROM LINEUP IN DATABASE //
	
	$scope.problemRemoving = [];

	// recursiveRemove to be called on event ng-click="saveLineup()" below
	$scope.recursiveRemove = function(arr, errors) {

		// break recursive logic after array is emptied
		if (arr.length == 0) return console.log("Remove finished with " + errors + " number of errors.")

			// empty the array one player at a time
			var cricketPlayer = arr.pop();

			// ajax
			var config = {headers: {"X-Auth-Parse": sessionToken}}; // set sessionToken in header
			$http.delete("/api/v1/lineupPlayers/" + cricketPlayer.lineupPlayer.id)
			.success(function(data, status) {
				console.log("### REMOVED ! ###");
				// * * * //
				$scope.recursiveRemove(arr, errors);
			})
			.error(function(data, status) {
				console.log("### ERROR! ###");
				$scope.problemRemoving.push(cricketPlayer);
				// * * * //
				$scope.recursiveRemove(arr, errors++);
			})

	};


	// SAVE FUNCTION ON EVENT NG-CLICK //
	$scope.saveLineup = function() {
		
		// * * * //
		$scope.processActionsQueue($scope.actionsQueue, 0);

		// remove
		var cricketPlayersToRemove = angular.copy($scope.cricketPlayersToRemove);
			// * * * //
			$scope.recursiveRemove(cricketPlayersToRemove, 0); 

		// gatekeeprs
		/*
		if (vm.numberOfBowlers < 3) return alert("Lineup cannot be saved. You only have " + (3 - vm.numberOfBowlers) + " bowlers. You need at least " + vm.numberOfBowlers + " more.");
		if (vm.numberOfBatsmen < 3) return alert("Lineup cannot be saved. You only have " + (3 - vm.numberOfBatsmen) + " batsmen. You need at least " + vm.numberOfBatsmen + " more.");
		if (vm.numberOfWicketKeepers === 1) return alert("Lineup cannot be saved. You need at least 1 wicket keeper.");
		if ($scope.currentBalance < 0) return alert("Lineup cannot be saved. Your $ balance is negative.");
		if ($scope.currentLineup.length < 11) return alert("Lineup cannot be saved. Your lineup must include 11 players.");
		*/

		// add
		var cricketPlayersToAdd = angular.copy($scope.cricketPlayersToAdd);
			// * * * //
			$scope.recursiveSave(cricketPlayersToAdd, 0);

		// empty arrays
		$scope.actionsQueue = [];
		$scope.cricketPlayersToRemove = [];
		$scope.cricketPlayersToAdd = [];

	};



	/////////////////////////////////
	////// addPlayerToTeam() ////////
	/////////////////////////////////
	
	$scope.addPlayerToTeam = function() {

		var selectedCricketPlayer = this.player;

		// Prevent user from adding same player to lineup if player has already been added to $scope.currentLineup
		var findWhereInScopeCurrentLineup = _.findWhere($scope.currentLineup, {id: selectedCricketPlayer.objectId});
		if (findWhereInScopeCurrentLineup) return alert("You have already added this player to your lineup.");

		// Prevent user from adding same player to lineup if player has already been added to $scope.currentSavedLineup
		var findWhereInScopeCurrentSavedLineup = _.findWhere($scope.currentSavedLineup, {id: selectedCricketPlayer.objectId});
		if (findWhereInScopeCurrentSavedLineup) return alert("You have already added this player to your lineup.");
		
		
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
		
		var addPlayer = function() {

			var lineupPlayer = new Player (selectedCricketPlayer.objectId, selectedCricketPlayer.name, selectedCricketPlayer.CricketPlayerType.name, selectedCricketPlayer.team, selectedCricketPlayer.cost);
			$scope.lineupPlayer = lineupPlayer;
			
			// * * * //
			$scope.currentLineup.push($scope.lineupPlayer);
			// decrement user's $ balance
			$scope.currentBalance -= selectedCricketPlayer.cost;

			// decrement user's lineup minimums accordingly
			if (selectedCricketPlayer.CricketPlayerType.name === "Bowler" && vm.numberOfBowlers > 0) {
				vm.numberOfBowlers --;
			} else if (selectedCricketPlayer.CricketPlayerType.name === "Batsman" && vm.numberOfBatsmen > 0) {
				vm.numberOfBatsmen --;
			} else if (selectedCricketPlayer.CricketPlayerType.name === "Wicket Keeper" && vm.numberOfWicketKeepers > 0) {
				vm.numberOfWicketKeepers --;
			} else if (selectedCricketPlayer.CricketPlayerType.name === "All Rounder" && vm.numberOfBatsmen > 0) {
				var isPlayerBatsman = confirm(selectedCricketPlayer.name + " is an All Rounder. Would you like him to count towards your minimum lineup requirements as a batsmen?");
				if (isPlayerBatsman == true) {
					vm.numberOfBatsmen --;
					$scope.allroundersAsBatsmen.push(selectedCricketPlayer.objectId);
					// console.log("$scope.allroundersAsBatsmen:", $scope.allroundersAsBatsmen);
				}
			} else if (selectedCricketPlayer.CricketPlayerType.name === "All Rounder" && vm.numberOfBowlers > 0) {
				var isPlayerBowler = confirm(selectedCricketPlayer.name + " is an All Rounder. Would you like him to count towards your minimum lineup requirements as a bowler?");
				if (isPlayerBowler == true) {
					vm.numberOfBowlers --;
					$scope.allroundersAsBowlers.push(selectedCricketPlayer.objectId);
					// console.log("$scope.allroundersAsBowlers:", $scope.allroundersAsBowlers);
				}
			}

		};
		addPlayer();

		// add selectedCricketPlayer to $scope.actionsQueue as type: "add" - if applicable
		var actionsQueueCounter = $scope.currentLineup.length;
		addPlayerToActionsQueueTypeAdd($scope.currentLineup[actionsQueueCounter - 1]);
		console.log("$scope.actionsQueue:", $scope.actionsQueue);
		console.log("$scope.currentSavedLineup:", $scope.currentSavedLineup);

	};



	////////////////////////////////
	//// removePlayerFromTeam() ////
	////////////////////////////////
	
	$scope.removePlayerFromTeam = function() {

		var selectedCricketPlayer = this.player;
		// console.log(selectedCricketPlayer.id);


		var playerId = selectedCricketPlayer.id;
		var playerName = selectedCricketPlayer.name;
		var playerPosition = selectedCricketPlayer.position;
		var playerTeam = selectedCricketPlayer.team;
		var playerCost = selectedCricketPlayer.cost;
		var user = {
			sessionToken: vm.user._sessionToken,
			objectId: vm.user.id
		};

		// VISUALLY REMOVE PLAYER FROM USER'S LINEUP
		var removePlayer = function() {
			for (var i=0; i < $scope.currentLineup.length; i++)
				if ($scope.currentLineup[i].id == playerId) {

					// set variables before splice
					var removedPlayerPosition = $scope.currentLineup[i].position;

					// * * * //
					$scope.currentLineup.splice(i,1);
					// increment user's $ balance
					$scope.currentBalance += selectedCricketPlayer.cost;
					

					// increment user's lineup minimums accordingly
					if (removedPlayerPosition === "Bowler" && vm.numberOfBowlers < 3) {
						vm.numberOfBowlers ++;
					} else if (removedPlayerPosition === "Batsman" && vm.numberOfBatsmen < 3) {
						vm.numberOfBatsmen ++;
					} else if (removedPlayerPosition === "Wicket Keeper" && vm.numberOfWicketKeepers < 1) {
						vm.numberOfWicketKeepers ++;
					} else if (removedPlayerPosition === "All Rounder" && $scope.allroundersAsBatsmen.length > 0) {
						
						// check whether player who has been removed is all rounder who was originally added as batsmen. if so, increment lineup minimum for batsmen.
						var findAllroundersAsBatsmen = _.find($scope.allroundersAsBatsmen, function (num) { return num == selectedCricketPlayer.id} );
						if (findAllroundersAsBatsmen && vm.numberOfBatsmen < 3) {
							vm.numberOfBatsmen ++;
						}
					
					} else if (removedPlayerPosition === "All Rounder" && $scope.allroundersAsBowlers.length > 0) {
						
						// check whether player who has been removed is all rounder who was originally added as bowler. if so, increment lineup minimum for bowlers.
						var findAllroundersAsBowlers = _.find($scope.allroundersAsBowlers, function(num) { return num == selectedCricketPlayer.id} );
						if (findAllroundersAsBowlers && vm.numberOfBowlers < 3) {
							vm.numberOfBowlers ++;
						}
					
					}


				}

		};
		removePlayer();

		// remove selectedCricketPlayer from actionsQueue (type: "add") - if applicable
		removePlayerFromActionsQueue(selectedCricketPlayer);

		// add selectedCricketPlayer to actionsQueue (type: "remove") - if applicable
		addPlayerToActionsQueueTypeRemove(selectedCricketPlayer);
		console.log("$scope.actionsQueue:", $scope.actionsQueue);
		console.log("$scope.currentSavedLineup:", $scope.currentSavedLineup);

	};



	////////////////////////////////
	///////// resetLineup() ////////
	////////////////////////////////
	
	$scope.resetLineup = function() {

		// empty actionsQueue array
		$scope.actionsQueue = [];

		// * * * //
		init();

	};



	////////////////////////////////
	/////// archiveLineup() ////////
	////////////////////////////////
	
	$scope.archiveLineup = function() {

		// copy lineup so it can be saved with matchId to database
		$scope.archivedLineup = angular.copy($scope.currentSavedLineup[0].lineupPlayers);
		console.log("$scope.archivedLineup:", $scope.archivedLineup);

	};

});
