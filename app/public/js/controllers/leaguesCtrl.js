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

	console.log('User: ', vm.user.attributes);

	$scope.addLeague = function() {
		vm.user.attributes.leagueId = $scope.leagueId;
		console.log('User: ', vm.user.attributes);
	};


	/////////////////////////////////
	/////////// AJAX GET ////////////
	/////////////////////////////////
	// $http.get("/api/leagues")
	// .success(function(response) {
	// 	$scope.leaguesInfo = response;
	// })
	// .error(function(error) {
	// 	alert("Sorry - there was an error. Try again.");
	// 	$location.path("/dashboard");
	// });


	////////////////////
	// WITH PROMISES //
	////////////////////

	$scope.leagueId = null;

	$scope.selectId = function(id) {
		$scope.leagueId = id;
	}

	Leagues.then(function(data) {
		$scope.leaguesInfo = data;
	});

	// console.log(leaguesInfo.objectId)

	
	////////////////////////////////
	/////////// NG-TABLE ///////////
	////////////////////////////////
	// var data = [];
	

	setTimeout(function(){
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



	// $scope.changeSelection = function(user) {
	    // console.info(user);
	// }

	////////////////////////////////
	////////// AJAX POST ///////////
	////////////////////////////////
	// $http.post("")

});
