var LineupPlayerController = require('../controllers/lineupPlayers');
var protectGetRoutes = require('../utility/protectGetRoutes');

var lineupPlayerController = new LineupPlayerController();

var lineupPlayerRoutes = function(app){
	app.post('/api/v1/lineupPlayers', lineupPlayerController.create);
	app.get('/api/v1/lineupPlayers', protectGetRoutes, lineupPlayerController.getAll);
};

module.exports = lineupPlayerRoutes;