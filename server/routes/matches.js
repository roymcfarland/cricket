var MatchesController = require('../controllers/matches');

var matchesController = new MatchesController();

var matchesRoutes = function(app){
	app.post('/api/v1/matches', matchesController.create);
};

module.exports = matchesRoutes;