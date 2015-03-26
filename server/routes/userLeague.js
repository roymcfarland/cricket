var UserLeagueController = require('../controllers/userLeague');

var userLeagueController = new UserLeagueController();

var userLeagueRoutes = function(app){
	app.get('/api/v1/userLeagues', userLeagueController.getAll);
};

module.exports = userLeagueRoutes;