var superagent = require('superagent');
var config = require('../config/config');

var UserController = function() {};

UserController.prototype.populateWithDefaultData = function(req, res) {
	var objectId = req.params.objectId;
	
	superagent
		.get('https://api.parse.com/1/users/' + objectId)
		.set('X-Parse-Application-Id', config.parse.applicationId)
		.set('X-Parse-Master-Key', config.parse.masterKey)
		.end(function(response){
			if(response.body.code == 101) return res.sendStatus(512);
			if(!response.body.newUser) return res.sendStatus(514);
		});
};

module.exports = UserController;