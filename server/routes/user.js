var UserController = require('../controllers/user');

var userController = new UserController();

var userRoutes = function(app) {
	app.post('/api/users/:objectId', userController.populateWithDefaultData);
};

module.exports = userRoutes;