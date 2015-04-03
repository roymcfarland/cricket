var Validatorjs = require('validatorjs');
var superagent = require('superagent');
var config = require('../config/config');

var CricketPlayerController = function(){};

CricketPlayerController.prototype.create = function(req, res) {
	var admin = req.user.admin;
	var validationRules = {
		name: 'required|alpha_num',
		team: 'required|alpha_num',
		cost: 'required|numeric',
		cricketPlayerTypeId: 'required|alpha_num'
	};
	var validation = new Validatorjs(req.body, validationRules);

	if(!admin) return res.sendStatus(403);
	if(validation.fails()) return res.status(428).send({errors: validation.errors.all()});

	superagent
		.post('https://api.parse.com/1/classes/CricketPlayer')
		.set('X-Parse-Application-Id', config.parse.applicationId)
		.set('X-Parse-REST-API-Key', config.parse.apiKey)
		.send({
			name: req.body.name,
			team: req.body.team,
			cost: req.body.cost,
			CricketPlayerTypeID: {
				__type: 'Pointer',
				className: 'CricketPlayerType',
				objectId: req.body.cricketPlayerTypeId
			}
		})
		.end(function(createCricketPlayerResult){
			if(createCricketPlayerResult.body.code) return res.status(500).send(createCricketPlayerResult.body);

			return res.status(201).send(createCricketPlayerResult.body);
		});
};

CricketPlayerController.prototype.getAll = function(req, res) {
	superagent
		.get('https://api.parse.com/1/classes/CricketPlayer')
		.set('X-Parse-Application-Id', config.parse.applicationId)
		.set('X-Parse-REST-API-Key', config.parse.apiKey)
		.query('include=CricketPlayerTypeID')
		.end(function(getAllResults){
			if(getAllResults.body.code) return res.status(500).send(getAllResults.body);

			return res.send(getAllResults.body.results);
		});
};

CricketPlayerController.prototype.getOne = function(req, res) {
	var validationRules = {
		objectId: 'alpha_num',
	};
	var validation = new Validatorjs(req.params, validationRules);

	if(validation.fails()) return res.status(428).send({errors: validation.errors.all()});

	superagent
		.get('https://api.parse.com/1/classes/CricketPlayer/' + req.params.objectId)
		.set('X-Parse-Application-Id', config.parse.applicationId)
		.set('X-Parse-REST-API-Key', config.parse.apiKey)
		.query('include=CricketPlayerTypeID')
		.end(function(getOneResult){
			if(getOneResult.body.code && getOneResult.body.code == 101) return res.sendStatus(404);
			if(getOneResult.body.code) return res.status(500).send(getOneResult.body);

			return res.send(getOneResult.body);
		});
};

CricketPlayerController.prototype.update = function(req, res) {
	var admin = req.user.admin;
	var validationRules = {
		name: 'alpha_num',
		team: 'alpha_num',
		cricketPlayerTypeId: 'alpha_num',
		cost: 'numeric'
	};
	var validation = new Validatorjs(req.body, validationRules);

	if(!admin) return res.sendStatus(403);
	if(validation.fails()) return res.status(428).send({errors: validation.errors.all()});
};

module.exports = CricketPlayerController;