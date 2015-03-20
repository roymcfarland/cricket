var UserController = require('../controllers/user');

var userController = new UserController();

var userRoutes = function(app) {
	app.post('/api/v1/users', userController.create);
	app.post('/api/users/:objectId', userController.populateWithDefaultData);
};

module.exports = userRoutes;