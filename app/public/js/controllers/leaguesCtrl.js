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
	// vm.userId = vm.user.id;
	vm.userMoney = vm.user.attributes.Money;
	// console.log("vm.user.attributes: ", vm.user.attributes);
	// console.log("vm.user: ", vm.user);



	/////////////////////////////////
	/////// leaguesService.js ///////
	/////////////////////////////////

	Leagues.then(function(result) {
		var data = result;
		$scope.data = data;

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
		        var orderedData = params.sorting() ?
		                $filter('orderBy')(data, params.orderBy()) :
		                data;

		        // params.total(orderedData.length); // set total for recalc pagination
		        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		    }
		});
	});

	$scope.disabled = true;

	$scope.changeSelection = function(league) {
        console.info(league);
        var obj = $scope.data;
        for(var key in obj) {
        	var obj2 = obj[key];
        	for (var key2 in obj2) {
        		if(key2 === '$selected') {
        			if(obj2[key2] === true) {
        				obj2[key2] = false;
        				league.$selected = true;
        				$scope.disabled = false;
        			}
        		}
        	}
        }
        console.log($scope.data);
	};

	$scope.checkSelected = function() {
		var obj = $scope.data;
		for(var key in obj) {
			var obj2 = obj[key];
			for (var key2 in obj2) {
				if(key2 === '$selected') {
					if(obj2[key2] === true) {
						$scope.disabled = false;
						break;
					} else {
						$scope.disabled = true;
					}
				}
			}
		}
	};



	/////////////////////////////////
	//////// join-league.html ///////
	/////////////////////////////////

	$scope.leagueId = null;
	$scope.leagueName = null;
	$scope.leagueEntryFee = null;

	// Attached to ng-click
	$scope.selectLeague = function(id, name, entryFee) {
		if ($scope.leagueId === id) {
			$scope.leagueId = null;
			$scope.leagueName = null;
			$scope.leagueEntryFee = null;
		} else {
			$scope.leagueId = id;
			$scope.leagueName = name;
			$scope.leagueEntryFee = entryFee;
		}
		console.log('League ID: ', $scope.leagueId);
		console.log('League name: ', $scope.leagueName);
		console.log('League entry free: ', $scope.leagueEntryFee);
	};



	/////////////////////////////////
	/////// addUserToLeague() ///////
	/////////////////////////////////

	$scope.addUserToLeague = function() {
		// vm.user.attributes.leagueId = $scope.leagueId;
		var leagueId = $scope.leagueId;
		console.log("leagueId: ", leagueId);
		var leagueName = $scope.leagueName;
		console.log("leagueName: ", leagueName);
		var leagueEntryFee = $scope.leagueEntryFee;
		console.log("leagueEntryFee: ", leagueEntryFee);
		// BP: Apparently the parse user object is not being sent to the server correctly, specifically the session token and the object id. That is why I created it here manually.
		var user = {
			sessionToken: vm.user._sessionToken,
			objectId: vm.user.id
		};

		/////////////////
		/// AJAX POST ///
		/////////////////
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
					alert("Sorry! This league is full. Please join another league. (Error 518)");
					$location.path("/dashboard");
				} else if (status == 519) {
					alert("You have already joined this league. Please join another. (Error 519)");
					$location.path("/dashboard");
				} else if (status == 500) {
					alert("Sorry! There was an error. Please try again. (Error 500)");
					$location.path("/dashboard");
			}});

	};
});
