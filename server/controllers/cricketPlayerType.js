var Validatorjs = require('validatorjs');
var superagent = require('superagent');
var config = require('../config/config');

var CricketPlayerTypeController = function(){};

CricketPlayerTypeController.prototype.create = function(req, res) {
	var admin = req.user.admin;

	if(!admin) return res.sendStatus(403);

	var validationRules = {
		name: 'required|alpha_num',
		lineUpMinimum: 'required|numeric'
	};
	var validation = new Validatorjs(req.body, validationRules);

	if(validation.fails()) return res.status(428).send({errors: validation.errors.all()});

	superagent
		.post('https://api.parse.com/1/classes/CricketPlayerType')
		.set('X-Parse-Application-Id', config.parse.applicationId)
		.set('X-Parse-REST-API-Key', config.parse.apiKey)
		.send({
			name: req.body.name,
			lineUpMinimum: req.body.lineUpMinimum
		})
		.end(function(createResult){
			if(createResult.body.code) return res.status(500).send(createResult.body);

			return res.status(201).send(createResult.body);
		});
};

CricketPlayerTypeController.prototype.getAll = function(req, res) {
	superagent
		.get('https://api.parse.com/1/classes/CricketPlayerType')
		.set('X-Parse-Application-Id', config.parse.applicationId)
		.set('X-Parse-REST-API-Key', config.parse.apiKey)
		.end(function(getAllResults){
			if(getAllResults.body.code) return res.status(500).send(getAllResults.body);

			return res.send(getAllResults.body.results);
		});
};

CricketPlayerTypeController.prototype.getOne = function(req, res) {
	superagent
		.get('https://api.parse.com/1/classes/CricketPlayerType/' + req.params.objectId)
		.set('X-Parse-Application-Id', config.parse.applicationId)
		.set('X-Parse-REST-API-Key', config.parse.apiKey)
		.end(function(getAllResults){
			if(getAllResults.body.code) return res.status(500).send(getAllResults.body);

			return res.send(getAllResults.body);
		});
};

CricketPlayerTypeController.prototype.update = function(req, res) {
	var admin = req.user.admin;
	var validationRules = {
		name: 'alpha_num',
		lineUpMinimum: 'numeric'
	};
	var validation = new Validatorjs(req.body, validationRules);

	if(!admin) return res.sendStatus(403);
	if(validation.fails()) return res.status(428).send({errors: validation.errors.all()});

	var payload = {};

	if(req.body.name) payload.name = req.body.name;
	if(req.body.lineUpMinimum) payload.lineUpMinimum = req.body.lineUpMinimum;

	superagent
		.put('https://api.parse.com/1/classes/CricketPlayerType/' + req.params.objectId)
		.set('X-Parse-Application-Id', config.parse.applicationId)
		.set('X-Parse-REST-API-Key', config.parse.apiKey)
		.send(payload)
		.end(function(updateResults){
			if(updateResults.body.code) return res.status(500).send(updateResults.body);

			return res.sendStatus(200);
		});
};

CricketPlayerTypeController.prototype.del = function(req, res) {
	var admin = req.user.admin;

	if(!admin) return res.sendStatus(403);

	superagent
		.del('https://api.parse.com/1/classes/CricketPlayerType/' + req.params.objectId)
		.set('X-Parse-Application-Id', config.parse.applicationId)
		.set('X-Parse-REST-API-Key', config.parse.apiKey)
		.end(function(updateResults){
			if(updateResults.body.code) return res.status(500).send(updateResults.body);

			return res.sendStatus(200);
		});
};

module.exports = CricketPlayerTypeController;