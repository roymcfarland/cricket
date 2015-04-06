var CricketPlayerTypesController = require('../controllers/cricketPlayerType');
var protectPostRoutes = require('../utility/protectPostRoutes');

var cricketPlayerTypesController = new CricketPlayerTypesController();

var cricketPlayerTypeRoutes = function(app){
	app.post('/api/v1/cricketPlayerTypes', protectPostRoutes, cricketPlayerTypesController.create);
	app.get('/api/v1/cricketPlayerTypes', cricketPlayerTypesController.getAll);
	app.get('/api/v1/cricketPlayerTypes/:objectId', cricketPlayerTypesController.getOne);
	app.put('/api/v1/cricketPlayerTypes/:objectId', protectPostRoutes, cricketPlayerTypesController.update);
	app.delete('/api/v1/cricketPlayerTypes/:objectId', protectPostRoutes, cricketPlayerTypesController.del);
};

module.exports = cricketPlayerTypeRoutes;