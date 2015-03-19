var LineupController = require('../controllers/lineup');

var lineupController = new LineupController();

var lineupRoutes = function(app){
	app.post('/api/v1/lineups', lineupController.create);
};

module.exports = lineupRoutes;