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

module.exports = CricketPlayerController;