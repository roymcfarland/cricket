var LineupPlayerController = require('../controllers/lineupPlayers');

var lineupPlayerController = new LineupPlayerController();

var lineupPlayerRoutes = function(app){
	app.post('/api/v1/lineupPlayers', lineupPlayerController.create);
};

module.exports = lineupPlayerRoutes;