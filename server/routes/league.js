var LeagueController = require('../controllers/league');

var leagueController = new LeagueController();

var leagueRoutes = function(app){
	app.post('/api/leagues', leagueController.create);
};

module.exports = leagueRoutes;