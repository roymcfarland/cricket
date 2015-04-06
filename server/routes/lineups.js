var LineupController = require('../controllers/lineup');
var protectGetRoutes = require('../utility/protectGetRoutes');

var lineupController = new LineupController();

var lineupRoutes = function(app){
	app.post('/api/v1/lineups', lineupController.create);
	app.get('/api/v1/lineups', protectGetRoutes, lineupController.getAll);
	app.get('/api/v1/lineups/:objectId', protectGetRoutes, lineupController.getOne);
};

module.exports = lineupRoutes;