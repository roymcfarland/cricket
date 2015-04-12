var UserLeagueController = require('../controllers/userLeague');
var protectGetRoutes = require('../utility/protectGetRoutes');
var protectPostRoutes = require('../utility/protectPostRoutes');

var userLeagueController = new UserLeagueController();

var userLeagueRoutes = function(app){
	app.get('/api/v1/userLeagues', protectGetRoutes, userLeagueController.getAll);
	app.post('/api/v1/userLeagues', protectPostRoutes, userLeagueController.create);
	app.get('/api/v1/userLeagues/:objectId', protectGetRoutes, userLeagueController.getOne);
};

module.exports = userLeagueRoutes;