var LeagueController = require('../controllers/league');

var leagueController = new LeagueController();

var leagueRoutes = function(app){
	app.post('/api/league', leagueController.create);
};

module.exports = leagueRoutes;