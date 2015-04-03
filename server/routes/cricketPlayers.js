var CricketPlayersController = require('../controllers/cricketPlayer');
var protectPostRoutes = require('../utility/protectPostRoutes');

var cricketPlayerController = new CricketPlayersController();

var cricketPlayerRoutes = function(app){
	app.post('/api/v1/cricketPlayers', protectPostRoutes, cricketPlayerController.create);
};

module.exports = cricketPlayerRoutes;