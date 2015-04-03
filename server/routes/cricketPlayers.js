var CricketPlayersController = require('../controllers/cricketPlayer');
var protectPostRoutes = require('../utility/protectPostRoutes');

var cricketPlayerController = new CricketPlayersController();

var cricketPlayerRoutes = function(app){
	app.post('/api/v1/cricketPlayers', protectPostRoutes, cricketPlayerController.create);
	app.get('/api/v1/cricketPlayers', cricketPlayerController.getAll);
	app.get('/api/v1/cricketPlayers/:objectId', cricketPlayerController.getOne);
	app.put('/api/v1/cricketPlayers/:objectId', protectPostRoutes, cricketPlayerController.update);
};

module.exports = cricketPlayerRoutes;