var protectGetRoutes = require('../utility/protectGetRoutes');
var protectPostRoutes = require('../utility/protectPostRoutes');
var UserController = require('../controllers/user');

var userController = new UserController();

var userRoutes = function(app) {
	app.post('/api/v1/users', userController.create);
	app.post('/api/users/:objectId', userController.populateWithDefaultData);
	app.get('/api/v1/users', protectGetRoutes, userController.getAll);
	app.get('/api/v1/users/:objectId', protectGetRoutes, userController.getOne);

	app.post('/api/v1/test', protectPostRoutes);
};

module.exports = userRoutes;