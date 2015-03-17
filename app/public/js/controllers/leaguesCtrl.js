var leaguesCtrl = angular.module("leaguesCtrl", []);

leaguesCtrl.controller("leaguesController", function($location, $scope, $http, $filter, ngTableParams, Leagues) {

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
	vm.userId = vm.user.id;
	vm.userMoney = vm.user.attributes.Money;

	console.log("vm.user.attributes: ", vm.user.attributes);
	console.log("vm.user: ", vm.user);



	/////////////////////////////////
	/////// leaguesService.js ///////
	/////////////////////////////////

	Leagues.then(function(data) {
		$scope.leaguesInfo = data;
	});



	/////////////////////////////////
	//////// join-league.html ///////
	/////////////////////////////////

	$scope.leagueId = null;
	$scope.leagueName = null;

	// Attached to ng-click
	$scope.selectId = function(id) {
		$scope.leagueId = id;
	}
	$scope.selectName = function(name) {
		$scope.leagueName = name;
	}



	/////////////////////////////////
	/////// addUserToLeague() ///////
	/////////////////////////////////

	$scope.addUserToLeague = function() {
		// vm.user.attributes.leagueId = $scope.leagueId;
		var leagueId = $scope.leagueId;
		console.log("leagueId: ", leagueId);
		var leagueName = $scope.leagueName;
		console.log("leagueName: ", leagueName);
		// Apparently the parse user object is not being sent to the server correctly, specifically the session token and the object id. That is why I created it here manually.
		var user = {
			sessionToken: vm.user._sessionToken,
			objectId: vm.user.id
		};

		$http.post("/api/v1/leagues/" + leagueId + "?addUser=true", {user: user}, [])
		.success(function(data, status) {
			$scope.data = data;
			$scope.status = status;
			if (status == 200) {
				alert("Congratulations! You have joined " + leagueName + ".");
				$location.path("/dashboard/join-league/team-builder");
		}})
		.error(function(data, status) {
			$scope.data = data;
			$scope.status = status;
			if (status == 518) {
				alert("Sorry! This league is full. Please join another league.");
				$location.path("/dashboard");
			} else if (status == 519) {
				alert("You have already joined this league. Please join another.");
				$location.path("/dashboard");
			} else if (status == 500) {
				alert("Sorry. There was an error. Please try again.");
				$location.path("/dashboard");
		}})

	};


	
	////////////////////////////////
	/////////// NG-TABLE ///////////
	////////////////////////////////
	var data = [];
	setTimeout(function() {
		// var data = $scope.leaguesInfo
		// $scope.data = data;

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
