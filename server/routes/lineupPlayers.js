var LineupPlayerController = require('../controllers/lineupPlayers');
var protectGetRoutes = require('../utility/protectGetRoutes');
var protectPostRoutes = require('../utility/protectPostRoutes');

var lineupPlayerController = new LineupPlayerController();

var lineupPlayerRoutes = function(app){
	app.post('/api/v1/lineupPlayers', lineupPlayerController.create);
	app.get('/api/v1/lineupPlayers', protectGetRoutes, lineupPlayerController.getAll);
	app.get('/api/v1/lineupPlayers/:objectId', protectGetRoutes, lineupPlayerController.getOne);
	app.put('/api/v1/lineupPlayers/:objectId', protectPostRoutes, lineupPlayerController.update);
};

module.exports = lineupPlayerRoutes;