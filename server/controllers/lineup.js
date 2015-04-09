var superagent = require('superagent');
var Validatorjs = require('validatorjs');
var async = require('async');

var LineupController = function(){};

var createRules = {
	UserLeagueId: 'required|alpha_num',
	MatchID: 'alpha_num',
	Locked: 'boolean',
	captain: 'alpha_num'
};

Validatorjs.register('boolean', function(value, requirement, attribute){
	if(typeof value == 'boolean') return true;
	return false;
}, 'The :attribute field must be a boolean.');

Validatorjs.register('objectId', function(value){
	if(!value) return false;
	if(value.objectId.match(/\W/g)) return false;

	return true;
}, 'The :attribute objectId must be included.');

Validatorjs.register('sessionToken', function(value){
	if(!value) return false;
	if(value.sessionToken.match(/\W/g)) return false;

	return true;
}, 'The :attribute sessionToken must be included.');

LineupController.prototype.create = function(req, res) {
	var validation = new Validatorjs(req.body, createRules);
	var currentUser;
	var MatchID = req.body.MatchID;

	if(validation.fails()) return res.status(428).send({errors: validation.errors.all()});

	async.series({
		createLineup: function(done){
			var payload = {
				UserLeagueID: {
					__type: 'Pointer',
					className: 'UserLeague',
					objectId: req.body.UserLeagueId
				},
				Locked: req.body.Locked
			};

			if(MatchID) {
				payload.MatchID = {
						__type: 'Pointer',
						className: 'Match',
						objectId: MatchID
					};
			}
			if(req.body.captain) payload.captain = {
				__type: 'Pointer',
				className: 'CricketPlayer',
				objectId: req.body.captain
			};

			superagent
				.post('https://api.parse.com/1/classes/Lineup')
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.send(payload)
				.end(function(createLineupResult){
					if(createLineupResult.body.code) return done({code: 500, error: createLineupResult.body});

					return done(null, createLineupResult.body);
				});
		}
	}, function(err, success){
		if(err) return res.status(err.code).send({error: err.error});

		return res.status(201).send(success.createLineup);
	});
};

LineupController.prototype.getAll = function(req, res) {
	superagent
	.get('https://api.parse.com/1/classes/Lineup')
	.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
	.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
	.query('include=UserLeagueID.UserID,captain')
	.query('limit=1000')
	.end(function(getAllResults){
		if(getAllResults.body.code) return res.status(500).send(getAllResults.body);

		return res.send(getAllResults.body.results);
	});
};

LineupController.prototype.getOne = function(req, res) {
	superagent
	.get('https://api.parse.com/1/classes/Lineup/' + req.params.objectId)
	.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
	.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
	.query('include=UserLeagueID.UserID,captain')
	.end(function(getAllResults){
		if(getAllResults.body.code) return res.status(500).send(getAllResults.body);

		return res.send(getAllResults.body);
	});
};

LineupController.prototype.update = function(req, res) {
	async.series({
		verifyCurrentUserOwnsLineup: function(done){
			superagent
			.get('https://api.parse.com/1/classes/Lineup/' + req.params.objectId)
			.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
			.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
			.query('include=UserLeagueID.UserID')
			.end(function(result){
				if(result.body.code) return done({code: 500, error: result.body});
				if(result.body.UserLeagueID.UserID.objectId != req.user.objectId) return done({code: 403});

				done();
			});
		},
		validateData: function(done){
			var rules = {
				Locked: 'boolean',
				MatchID: 'alpha_num',
				captain: 'alpha_num'
			};
			var validation = new Validatorjs(req.body, rules);

			if(validation.fails()) return done({code: 428, error: {errors: validation.errors.all()}});
			done();
		},
		updateLineup: function(done){
			var payload = {};

			if(req.body.Locked == false || req.body.Locked) payload.Locked = req.body.Locked;
			if(req.body.MatchID) payload.MatchID = {
				__type: 'Pointer',
				className: 'Match',
				objectId: req.body.MatchID
			};

			superagent
			.put('https://api.parse.com/1/classes/Lineup/' + req.params.objectId)
			.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
			.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
			.send(payload)
			.end(function(result){
				console.log(result.body);
				if(result.body.code) return done({code: 500, error: result.body});

				done();
			});
		}
	}, function(err, results){
		if(err && err.code && err.error) return res.status(err.code).send(err.error);
		if(err && err.code) return res.sendStatus(err.code);

		return res.sendStatus(200);
	});
};

LineupController.prototype.del = function(req, res) {
	async.series({
		verifyCurrentUserOwnsLineup: function(done){
			superagent
			.get('https://api.parse.com/1/classes/Lineup/' + req.params.objectId)
			.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
			.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
			.query('include=UserLeagueID.UserID')
			.end(function(result){
				if(result.body.code) return done({code: 500, error: result.body});
				if(result.body.UserLeagueID.UserID.objectId != req.user.objectId) return done({code: 403});

				done();
			});
		},
		deleteLineup: function(done){
			superagent
			.del('https://api.parse.com/1/classes/Lineup/' + req.params.objectId)
			.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
			.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
			.end(function(result){
				if(result.body.code) return done({code: 500, error: result.body});

				done();
			});
		}
	}, function(err, success){
		if(err && err.code && err.code.error) return res.status(err.code).send(err.error);
		if(err && err.code) return res.sendStatus(err.code);

		return res.sendStatus(200);
	});
};

module.exports = LineupController;