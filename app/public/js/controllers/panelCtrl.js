var panelCtrl = angular.module("panelCtrl", []);

panelCtrl.controller("panelController", ["$location", "$scope", "$http", function($location, $scope, $http) {

	this.tab = 1;

	this.selectTab = function(setTab) {
		this.tab = setTab || 0;
	};

	this.isSelected = function(checkTab) {
		return this.tab === checkTab;
	};

}]);