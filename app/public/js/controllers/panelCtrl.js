var panelCtrl = angular.module("panelCtrl", []);

panelCtrl.controller("panelController", function($location, $scope, $http) {

	this.tab = 1;

	this.selectTab = function(setTab) {
		this.tab = setTab || 0;
	};

	this.isSelected = function(checkTab) {
		return this.tab === checkTab;
	};

});