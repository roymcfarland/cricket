var dashboardCtrl = angular.module("dashboardCtrl", []);

dashboardCtrl.controller("dashboardController", function($location, $scope, $http) {
	
	/////////////////////////////////
	/////////// Variables ///////////
	/////////////////////////////////

	// VM
	var vm = this;
	vm.user = Parse.User.current();
	vm.username = vm.user.getUsername();
	vm.userMoney = vm.user.attributes.Money;
	
	var user = Parse.User.current();
	var userId = user.id;
	var sessionToken = user._sessionToken;
	

	/////////////////////////////////
	//////// Initialization /////////
	/////////////////////////////////

	var init = function() {

		// Is the user logged in?
		if(!vm.user) return $location.path("/");

		// Get user's leagues
		$http.get("/api/v1/userLeagues?leagueId=" + "&userId=" + userId + "&sessionToken=" + sessionToken, {}, [])
			.success(function(response, status) {
				$scope.userLeagues = response;
				$scope.status = status;
				if (status == 200) {
					// console.log("$scope.status:", $scope.status);
					// console.log("$scope.userLeagues:", $scope.userLeagues);
				}
			})
			.error(function(response, status) {
				$scope.response = response;
				$scope.status = status;
				if (status == 500) {
					console.log("error response:", response);
					alert("Error (500)");
					$location.path("/dashboard");
				}
			});

	};

	init();



	/////////////////////////////////
	//////// dashboard.html /////////
	/////////////////////////////////






	/////////////////////////////////
	///////////// ASIDE /////////////
	/////////////////////////////////
	$scope.aside = {
		"title": "Easter Egg",
		"content": "Testing Angular Strap!"
	};

});