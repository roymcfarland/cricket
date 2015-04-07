var MatchesController = require('../controllers/matches');

var matchesController = new MatchesController();

var matchesRoutes = function(app){
	app.post('/api/v1/matches', matchesController.create);
	app.get('/api/v1/matches', matchesController.getAll);
	app.get('/api/v1/matches/:objectId', matchesController.getOne);
};

module.exports = matchesRoutes;