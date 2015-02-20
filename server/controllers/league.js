var superagent = require('superagent');
var config = require('../config/config');

var LeagueController = function(){};

LeagueController.prototype.create = function(req, res) {
	if('objectId' in req.body == false) return res.sendStatus(404);

	superagent
		.get('https://api.parse.com/1/users/' + req.params.objectId)
		.set('X-Parse-Application-Id', config.parse.applicationId)
		.set('X-Parse-Master-Key', config.parse.masterKey)
		.end(function(response){
			if(response.body.error) return res.sendStatus(404);
		});
};

module.exports = LeagueController;