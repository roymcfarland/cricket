var superagent = require('superagent');
var config = require('../config/config');
var baseRules = require('../config/rules.json');

var setRules = function(ruleChanges){
	if(!ruleChanges) return baseRules;
};

var LeagueController = function(){};

LeagueController.prototype.create = function(req, res) {
	if('objectId' in req.body == false) return res.sendStatus(404);
	if('name' in req.body == false) return res.sendStatus(515);

	superagent
		.get('https://api.parse.com/1/users/' + req.body.objectId)
		.set('X-Parse-Application-Id', config.parse.applicationId)
		.set('X-Parse-Master-Key', config.parse.masterKey)
		.end(function(response){
			if(response.body.error) return res.sendStatus(404);

			var rules = setRules(req.body.rules || null);

			superagent
				.post('https://api.parse.com/1/classes/League')
				.set('X-Parse-Application-Id', config.parse.applicationId)
				.set('X-Parse-Master-Key', config.parse.masterKey)
				.set('Content-Type', 'application/json')
				.send({
					"totalScore": 0,
					"owner": req.body.objectId,
					"rules": setRules(),
					"name": req.body.name
				})
				.end(function(createLeagueResponse){
					if(createLeagueResponse.body.error) return res.status(516).send(createLeagueResponse.body.error);

					res.status(200).send(createLeagueResponse.body);
				});
		});
};

module.exports = LeagueController;