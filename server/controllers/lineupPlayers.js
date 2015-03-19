var superagent = require('superagent');
var Validatorjs = require('validatorjs');
var async = require('async');

var createRules = {
	user: 'objectId|sessionToken',
	LineupID: 'required|alpha_num',
	CricketPlayerID: 'required|alpha_num'
};

Validatorjs.register('objectId', function(value){
	if(!value || !value.objectId) return false;
	if(value.objectId.match(/\W/g)) return false;

	return true;
}, 'The :attribute objectId must be included.');

Validatorjs.register('sessionToken', function(value){
	if(!value || !value.sessionToken) return false;
	if(value.sessionToken.match(/\W/g)) return false;

	return true;
}, 'The :attribute sessionToken must be included.');

var LineupPlayerController = function(){};

LineupPlayerController.prototype.create = function(req, res) {
	var validation = new Validatorjs(req.body, createRules);

	if(validation.fails()) return res.status(428).send({errors: validation.errors.all()});

	async.series({
		checkIfUserIsLoggedIn: function(done){
			superagent
				.get('https://api.parse.com/1/users/me')
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.set('X-Parse-Session-Token', req.body.user.sessionToken)
				.end(function(checkIfUserIsLoggedInResult){
					if(checkIfUserIsLoggedInResult.body.code) return done({code: 520, error: checkIfUserIsLoggedInResult.body});

					done();
				});
		},
		createLineupPlayer: function(done){
			console.log(req.body);
			superagent
				.post('https://api.parse.com/1/classes/LineupPlayer')
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.send({
					LineupID: {
						__type: 'Pointer',
						className: 'Lineup',
						objectId: req.body.LineupID
					},
					CricketPlayerID: {
						__type: 'Pointer',
						className: 'CricketPlayer',
						objectId: req.body.CricketPlayerID
					}
				})
				.end(function(createLineupPlayerResult){
					if(createLineupPlayerResult.body.code) return done({code: 500, error: createLineupPlayerResult.body});

					done(null, createLineupPlayerResult.body);
				});
		}
	}, function(err, success){
		if(err && err.code) return res.status(err.code).send({error: err.error});

		return res.status(201).send(success.createLineupPlayer);
	});
};

module.exports = LineupPlayerController;