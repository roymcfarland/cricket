var CricketPlayerTypesController = require('../controllers/cricketPlayerType');
var protectPostRoutes = require('../utility/protectPostRoutes');

var cricketPlayerTypesController = new CricketPlayerTypesController();

var cricketPlayerTypeRoutes = function(app){
	app.post('/api/v1/cricketPlayerTypes', protectPostRoutes, cricketPlayerTypesController.create);
	app.get('/api/v1/cricketPlayerTypes', cricketPlayerTypesController.getAll);
};

module.exports = cricketPlayerTypeRoutes;