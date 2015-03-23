var superagent = require('superagent');
var Validatorjs = require('validatorjs');
var config = require('../config/config');

var createRules = {
	username: 'required|alpha_num',
	password: 'required',
	email: 'required|email'
};

var UserController = function() {};

UserController.prototype.create = function(req, res) {
	var validation = new Validatorjs(req.body, createRules);

	if(validation.fails()) return res.status(428).send({errors: validation.errors.all()});

	superagent
		.post('https://api.parse.com/1/users')
		.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
		.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
		.send({
			username: req.body.username,
			password: req.body.password,
			email: req.body.email,
			totalScore: 0,
			Money: 0,
			admin: false
		})
		.end(function(createUserResult){
			if(createUserResult.body.code) return res.status(500).send(createUserResult.body);

			res.status(201).send(createUserResult.body);
		});
};

UserController.prototype.populateWithDefaultData = function(req, res) {
	var objectId = req.params.objectId;
	
	superagent
		.get('https://api.parse.com/1/users/' + objectId)
		.set('X-Parse-Application-Id', config.parse.applicationId)
		.set('X-Parse-Master-Key', config.parse.masterKey)
		.end(function(response){
			if(response.body.code == 101) return res.sendStatus(512);
			if(!response.body.newUser) return res.sendStatus(514);

			superagent
				.put('https://api.parse.com/1/users/' + objectId)
				.set('X-Parse-Application-Id', config.parse.applicationId)
				.set('X-Parse-Master-Key', config.parse.masterKey)
				.set('Content-Type', 'application/json')
				.send({
					"totalScore": 0,
					"leagues": [],
					"newUser": false
				})
				.end(function(response){
					if(response.body.error) return res.status(513).send(response.body);

					return res.sendStatus(200);
				});
		});
};

module.exports = UserController;