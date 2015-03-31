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
	var user = Parse.User.current();
	var userId = user.id;
	var sessionToken = user._sessionToken;



	/////////////////////////////////
	//////// Initialization /////////
	/////////////////////////////////
	var init = function() {

		// Is the user logged in?
		if(!vm.user) return $location.path("/");

		// Is the user a member of this league?
		$http.get("/api/v1/userLeagues?leagueId=" + leagueId + "&userId=" + userId + "&sessionToken=" + sessionToken, {}, [])
			.success(function(data, status) {
				$scope.data = data;
				$scope.status = status;
				if (status == 200) {
				alert("League membership confirmed!");
			}})
			.error(function(data, status) {
				$scope.data = data;
				$scope.status = status;
				if (status == 428) {
					console.log(data);
					alert("Error: " + data.errors.leagueId[0] + " (428)");
					$location.path("/dashboard/leagues");
				}
			});
	};

	init();



	/////////////////////////////////
	///// teamBuilderService.js /////
	/////////////////////////////////
	
	Players.then(function(data) {
		$scope.players = data;
	});



	/////////////////////////////////
	/////// team-builder.html ///////
	/////////////////////////////////

	// ng-click
	$scope.selectId = function(id) {
		$scope.playerId = id;
	};
	
	$scope.selectName = function(name) {
		$scope.playerName = name;
	};
	
	$scope.selectPlayerType = function(playerType) {
		$scope.playerType = playerType;
	};
	
	$scope.selectPlayerTeam = function(playerTeam) {
		$scope.playerTeam = playerTeam;
	}



	/////////////////////////////////
	////// addPlayerToTeam() ////////
	/////////////////////////////////
	
	$scope.addPlayerToTeam = function() {
		var playerId = $scope.playerId;
		console.log("playerId: ", playerId);
		var playerName = $scope.playerName;
		console.log("playerName: ", playerName);
		var playerType = $scope.playerType;
		console.log("playerType: ", playerType);
		var playerTeam = $scope.playerTeam;
		console.log("playerTeam: ", playerTeam);

		// See BP comment in leaguesCtrl.js
		var user = {
			sessionToken: vm.user._sessionToken,
			objectId: vm.user.id
		};

		// AJAX POST //
		/*
		$http.post("/api/v1/players" + playerId + "?addUser=true", {user: user}, [])
		.success(function(data, status) {
			$scope.data = data;
			$scope.status = status;
			if (status == 200) {
				alert("Congratulations! You have added " + playerName + "to your team!");
				$location.path("/dashboard/leagus/createLineup/:leagueId");
		}})
		.error(function(data, status) {
			$scope.data = data;
			$scope.status = status;
			if (status == 404) {
				alert("Sorry! There was an error. Please try again. (Error 404)");
				$location.path("/dashboard/leagues/createLineup/:leagueId");
		}})
		*/
	};



	////////////////////////////////
	//// removePlayerFromTeam() ////
	////////////////////////////////
	
	$scope.removePlayerFromTeam = function() {
		var playerId = $scope.playerId;
		console.log("playerId: ", playerId);
		var playerName = $scope.playerName;
		console.log("playerName: ", playerName);
		var playerType = $scope.playerType;
		console.log("playerType: ", playerType);
		var playerTeam = $scope.playerTeam;
		console.log("playerTeam: ", playerTeam);

		// See BP comment in leaguesCtrl.js
		var user = {
			sessionToken: vm.user._sessionToken,
			objectId: vm.user.id
		}

		///// AJAX  ////


	};

});
