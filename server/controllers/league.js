var superagent = require('superagent');
var prop = require('deep-property');
var config = require('../config/config');
var baseRules = require('../config/rules.json');

var setRules = function(ruleChanges){
	if(!ruleChanges) return baseRules;

	var newRules = baseRules;

	ruleChanges.forEach(function(ruleChange){
		if(prop.has(newRules, ruleChange[0])){
			prop.set(newRules, ruleChange[0], ruleChange[1]);
		}
		else throw 517;
	});

	return newRules;
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
			var rules;

			try {
				rules = setRules(req.body.rules || null);
			}
			catch(err){
				return res.sendStatus(err);
			}

			superagent
				.post('https://api.parse.com/1/classes/League')
				.set('X-Parse-Application-Id', config.parse.applicationId)
				.set('X-Parse-Master-Key', config.parse.masterKey)
				.set('Content-Type', 'application/json')
				.send({
					"totalScore": 0,
					"owner": req.body.objectId,
					"rules": rules,
					"name": req.body.name
				})
				.end(function(createLeagueResponse){
					if(createLeagueResponse.body.error) return res.status(516).send(createLeagueResponse.body.error);

					res.status(200).send(createLeagueResponse.body);
				});
		});
};

LeagueController.prototype.getAll = function(req, res) {
	if(req.query.owner){
		if(req.query.objectId){
			var query = JSON.stringify({owner: req.query.objectId});

			superagent
				.get('https://api.parse.com/1/classes/League')
				.set('X-Parse-Application-Id', config.parse.applicationId)
				.set('X-Parse-Master-Key', config.parse.masterKey)
				.query('where=' + query + '}')
				.end(function(response){
					if(response.body.error) return res.status(518).send(response.body.error);

					res.send(response.body.results);
				});
		}
		else{
			res.sendStatus(427);
		}
	}
	else{
		superagent
			.get('https://api.parse.com/1/classes/League')
			.set('X-Parse-Application-Id', config.parse.applicationId)
			.set('X-Parse-Master-Key', config.parse.masterKey)
			.end(function(response){
				if(response.body.error) return res.status(518).send(response.body.error);

				res.send(response.body.results);
			});
	}
};

LeagueController.prototype.addToLeague = function(req, res) {
	var leagueId = req.params.leagueId;
	var addUser = req.query.addUser;
	
	if(!'objectId' in req.body.user) return res.status(428).send({error: 'user object not passed in'});

	superagent
		.get('https://api.parse.com/1/classes/League/' + leagueId)
		.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
		.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
		.end(function(result){
			if(result.body.code) return res.status(500).send(result.body);

			if(result.body.noOfEntries <= result.body.maxEntries) return res.sendStatus(518);

			var query = {
				LeagueID: {
					__type: 'Pointer',
					className: 'League',
					objectId: leagueId
				},
				UserID: {
					__type: 'Pointer',
					className: '_User',
					objectId: req.body.user.objectId
				}
			};
			var queryJson = JSON.stringify(query);

			superagent
				.get('https://api.parse.com/1/classes/UserLeague')
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.query('where=' + queryJson)
				.end(function(queryResult){
					if(result.body.code) return res.status(500).send(result.body);

					superagent
						.get('https://api.parse.com/1/classes/League/' + leagueId)
						.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
						.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
						.end(function(result){
							if(result.body.code) return res.status(500).send(result.body);

							if(!result.body.multiEntry && queryResult.body.results.length > 0) return res.sendStatus(519);
						
						superagent
							.post('https://api.parse.com/1/classes/UserLeague')
							.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
							.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
							.set('Content-Type', 'application/json')
							.send({
								LeagueID: {
									__type: "Pointer",
									className: "League",
									objectId: leagueId
								},
								UserID: {
									__type: "Pointer",
									className: "_User",
									objectId: req.body.user.objectId
								}
							})
							.end(function(result){
								if(result.body.code) return res.status(500).send(result.body);

								res.send(result.body);
							});
						});

				});

		});
};

module.exports = LeagueController;