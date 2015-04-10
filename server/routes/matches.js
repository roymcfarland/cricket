var MatchesController = require('../controllers/matches');
var protectPostRoutes = require('../utility/protectPostRoutes');

var matchesController = new MatchesController();

var matchesRoutes = function(app){
	app.post('/api/v1/matches', matchesController.create);
	app.get('/api/v1/matches', matchesController.getAll);
	app.get('/api/v1/matches/:objectId', matchesController.getOne);
	app.put('/api/v1/matches/:objectId', protectPostRoutes, matchesController.update);
	app.delete('/api/v1/matches/:objectId', protectPostRoutes, matchesController.del);
};

module.exports = matchesRoutes;