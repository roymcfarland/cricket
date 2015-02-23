////////////////////////////////////////
/////////////  PARSE DB  ///////////////
////////////////////////////////////////

Parse.initialize("GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD", "tiAbB7WfaIdHr4RKfdDQ7FeeYBjDysL6lRI8oHzw");



////////////////////////////////////////
//////////////  NG-APP  ////////////////
////////////////////////////////////////

var cricketDuel = angular.module("cricketDuel", [
	"appRouter",
	"indexCtrl",
	"leaderboardCtrl",
	"rulesCtrl",
	"loginCtrl",
	"registerCtrl",
	"dashboardCtrl",
	"myteamCtrl",
	"tradesCtrl",
	"termsCtrl",
	"contactCtrl",
	"adminCtrl"
]);
