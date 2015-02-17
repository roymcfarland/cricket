var loginCtrl = angular.module("loginCtrl", []);

var boo;

loginCtrl.controller("loginController", ['$location', '$scope', function($location, $scope) {
	// Bind view-model
	var vm = this;
	vm.heading = "Please login by using the form below!";
	vm.doLogin = function() {
		Parse.User.logIn(vm.loginData.username, vm.loginData.password)
			.then(function(user){
				$scope.$apply(function(){
					$location.path('/dashboard');
				});
			})
			.fail(function(err){
				alert(err.message);
				$scope.$apply(function(){
					$location.path('/');
				});
			});
	};
}]);

loginCtrl.controller("fcbkLoginController", function() {
	// Bind view-model
	var vm = this;
	vm.doLogin = function() {
		// Insert logic
	};
});