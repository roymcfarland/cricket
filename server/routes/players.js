var PlayerController = require('../controllers/player.js');

var playerController = new PlayerController();

var playerRoutes = function(app){
	app.get('/api/v1/players', playerController.getAll);
};

module.exports = playerRoutes;