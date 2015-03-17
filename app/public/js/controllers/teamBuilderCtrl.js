var teamBuilderCtrl = angular.module("teamBuilderCtrl", []);

teamBuilderCtrl.controller("teamBuilderController", function($location, $scope, $http, $filter, ngTableParams, Players) {

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
	// console.log("vm.user.attributes: ", vm.user.attributes);
	// console.log("vm.user: ", vm.user);



	/////////////////////////////////
	///// teamBuilderService.js /////
	/////////////////////////////////
	
	Players.then(function(data) {
		$scope.players = data;
	});



	/////////////////////////////////
	/////// team-builder.html ///////
	/////////////////////////////////
	
	$scope.playerId = null;
	$scope.playerName = null;
	$scope.playerType = null;
	$scope.playerTeam = null;

	// Attached to ng-click
	$scope.selectId = function(id) {
		$scope.playerId = id;
	}
	$scope.selectName = function(name) {
		$scope.playerName = name;
	}
	$scope.selectPlayerType = function(playerType) {
		$scope.playerType = playerType;
	}
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

		/////////////////
		/// AJAX POST ///
		/////////////////
		$http.post("/api/v1/players" + playerId + "?addUser=true", {user: user}, [])
		.success(function(data, status) {
			$scope.data = data;
			$scope.status = status;
			if (status == 200) {
				alert("Congratulations! You have added " + playerName + "to your team!");
				$location.path("/dashboard/join-league/team-builder");
		}})
		.error(function(data, status) {
			$scope.data = data;
			$scope.status = status;
			if (status == 404) {
				alert("Sorry! There was an error. Please try again. (Error 404)");
				$location.path("/dashboard/join-league/team-builder");
			}
		})
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

		////////////////
		/// AJAX PUT ///
		////////////////


	};



	////////////////////////////////
	/////////// NG-TABLE ///////////
	////////////////////////////////
	var data = [];
	// $scope.data = data;
	setTimeout(function() {

	$scope.tableParams = new ngTableParams({
	    // Show first page
	    page: 1,
	    // Show 10 results per page
	    count: 10,
	    filter: {
	        // Establish initial filter
	        // name: 'M'
	    },
	    sorting: {
	        // Establish initial sorting
	        //name: 'asc'
	    }
	}, {
	    total: data.length, // length of data
	    getData: function ($defer, params) {
	        // Angular filter
	        var filteredData = params.filter() ?
	                $filter('filter')(data, params.filter()) :
	                data;
	        var orderedData = params.sorting() ?
	                $filter('orderBy')(filteredData, params.orderBy()) :
	                data;

	        params.total(orderedData.length); // set total for recalc pagination
	        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
	    	}
		});
	}, 500);
});
