var UserLeagueController = require('../controllers/userLeague');
var protectGetRoutes = require('../utility/protectGetRoutes');

var userLeagueController = new UserLeagueController();

var userLeagueRoutes = function(app){
	app.get('/api/v1/userLeagues', protectGetRoutes, userLeagueController.getAll);
};

module.exports = userLeagueRoutes;