var PlayerController = require('../controllers/player.js');

var playerController = new PlayerController();

var playerRoutes = function(app){
	app.get('/api/v1/players', playerController.getAll);
	app.get('/api/v1/players/:objectId', playerController.getOne);
};

module.exports = playerRoutes;