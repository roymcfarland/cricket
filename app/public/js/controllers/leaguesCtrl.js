var leaguesCtrl = angular.module("leaguesCtrl", []);

dashboardCtrl.controller("leaguesController", function($location, $scope, $http, $filter, ngTableParams) {
	
	// First screen for user authentication
	var user = Parse.User.current();
	if(!user) return $location.path("/");

	// For authenticated users
	this.username = user.getUsername();
	this.testMessage = "This is the page where you can join a league. Coming soon!";

	// GET request for rules.json from server
	$http.get("/api/leagues")
	.success(function(response) {
		$scope.leagues = response;
	})
	.error(function(error) {
		alert("Sorry - there was an error. Try again.");
		$location.path("/");
	});

	var data = [];
	$scope.data = data;

	$scope.tableParams = new ngTableParams({
	    page: 1,            // show first page
	    count: 10,          // count per page
	    filter: {
	        //name: 'M'       // initial filter
	    },
	    sorting: {
	        //name: 'asc'     // initial sorting
	    }
	}, {
	    total: data.length, // length of data
	    getData: function ($defer, params) {
	        // use build-in angular filter
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

	$scope.changeSelection = function(user) {
	    // console.info(user);
	}

});
