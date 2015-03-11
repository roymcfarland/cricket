var LeagueController = require('../controllers/league');

var leagueController = new LeagueController();

var leagueRoutes = function(app){
	app.post('/api/leagues', leagueController.create);
	app.get('/api/leagues', leagueController.getAll);
	app.post('/api/v1/leagues/:leagueId', leagueController.addToLeague);
};

module.exports = leagueRoutes;