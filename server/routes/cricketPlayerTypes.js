var CricketPlayerTypesController = require('../controllers/cricketPlayerType');
var protectPostRoutes = require('../utility/protectPostRoutes');

var cricketPlayerTypesController = new CricketPlayerTypesController();

var cricketPlayerTypeRoutes = function(app){
	app.post('/api/v1/cricketPlayerTypes', protectPostRoutes, cricketPlayerTypesController.create);
};

module.exports = cricketPlayerTypeRoutes;