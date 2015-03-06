var teamBuilderCtrl = angular.module("teamBuilderCtrl", []);

teamBuilderCtrl.controller("teamBuilderController", function($location, $scope, $http, $filter, ngTableParams) {

	// First screen for user authentication
	var user = Parse.User.current();
	if(!user) return $location.path("/");

	// For authenticated users
	this.username = user.getUsername();
	this.testMessage = "This is the team builder page.";

	// AJAX request for players.json from server
	$http.get("/api/players")
	.success(function(response) {
		$scope.players = response;
	})
	.error(function(error) {
		alert("Sorry - there was an error. Try again.");
		$location.path("/");
	});

	// ngTable
	var data = [];
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

	$scope.changeSelection = function(user) {
	    // console.info(user);
	}

});
