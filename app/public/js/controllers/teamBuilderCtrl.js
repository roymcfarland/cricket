var teamBuilderCtrl = angular.module("teamBuilderCtrl", []);

teamBuilderCtrl.controller("teamBuilderController", function($location, $scope, $http, $filter, ngTableParams) {

	/////////////////////////////////
	////// USER AUTHENTICATION //////
	/////////////////////////////////
	var user = Parse.User.current();
	if(!user) return $location.path("/");


	/////////////////////////////////
	/// ACQUIRE CURRENT USER INFO ///
	/////////////////////////////////
	this.username = user.getUsername();
	this.userId = user.id;
	this.userScore = user.attributes.totalScore;


	/////////////////////////////////
	/////////// AJAX GET ////////////
	/////////////////////////////////
	$http.get("/api/v1/players")
	.success(function(response) {
		$scope.players = response;
		// console.log(typeof(response));
		// console.log(response);
	})
	.error(function(error) {
		alert("Sorry - there was an error. Try again.");
		$location.path("/");
	});


	////////////////////////////////
	/////////// NG-TABLE ///////////
	////////////////////////////////
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

	// $scope.changeSelection = function(user) {
	//     // console.info(user);
	// }

});
