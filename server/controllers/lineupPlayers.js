var superagent = require('superagent');
var Validatorjs = require('validatorjs');
var async = require('async');

var createRules = {
	LineupID: 'required|alpha_num',
	CricketPlayerID: 'required|alpha_num'
};

var LineupPlayerController = function(){};

LineupPlayerController.prototype.create = function(req, res) {
	var validation = new Validatorjs(req.body, createRules);

	if(validation.fails()) return res.status(428).send({errors: validation.errors.all()});

	async.series({
		createLineupPlayer: function(done){
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

LineupPlayerController.prototype.getAll = function(req, res) {
	superagent
	.get('https://api.parse.com/1/classes/LineupPlayer')
	.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
	.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
	.query('include=LineupID.UserLeagueID.LeagueID,CricketPlayerID.CricketPlayerTypeID')
	.end(function(getAllResults){
		if(getAllResults.body.code) return res.status(500).send(getAllResults.body);

		return res.send(getAllResults.body.results);
	});
};

LineupPlayerController.prototype.getOne = function(req, res) {
	superagent
	.get('https://api.parse.com/1/classes/LineupPlayer/' + req.params.objectId)
	.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
	.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
	.query('include=LineupID.UserLeagueID.LeagueID,CricketPlayerID.CricketPlayerTypeID')
	.end(function(getOneResult){
		if(getOneResult.body.code) return res.status(500).send(getOneResult.body);

		return res.send(getOneResult.body);
	});
};

LineupPlayerController.prototype.update = function(req, res) {
	async.series({
		verifyCurrentUserIsOwner: function(done){
			superagent
			.get('https://api.parse.com/1/classes/LineupPlayer/' + req.params.objectId)
			.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
			.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
			.query('include=LineupID.UserLeagueID.UserID')
			.end(function(result){
				if(result.body.code) return done({code: 500, error: result.body});
				if(result.body.LineupID.UserLeagueID.UserID.objectId != req.user.objectId) return done({code:403});

				done();
			});
		},
		validateData: function(done){
			var rules = {
				LineupID: 'alpha_num',
				CricketPlayerID: 'alpha_num'
			};
			var validation = new Validatorjs(req.body, rules);

			if(validation.fails()) return done({code: 428, error: {errors: validation.errors.all()}});

			done();
		},
		updateLineupPlayer: function(done){
			var payload = {};

			if(req.body.LineupID) payload.LineupID = {
				__type: 'Pointer',
				className: 'Lineup',
				objectId: req.body.LineupID
			};
			if(req.body.CricketPlayerID) payload.CricketPlayerID = {
				__type: 'Pointer',
				className: 'CricketPlayer',
				objectId: req.body.CricketPlayerID
			};

			superagent
			.put('https://api.parse.com/1/classes/LineupPlayer/' + req.params.objectId)
			.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
			.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
			.send(payload)
			.end(function(result){
				if(result.body.code) return done({code: 500, error: result.body});

				return done();
			});
		}
	}, function(err, success){
		if(err && err.code && err.error) return res.status(err.code).send(err.error);
		if(err && err.code) return res.sendStatus(err.code);

		return res.sendStatus(200);
	});
};

LineupPlayerController.prototype.del = function(req, res) {
	async.series({
		verifyCurrentUserIsOwner: function(done){
			superagent
			.get('https://api.parse.com/1/classes/LineupPlayer/' + req.params.objectId)
			.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
			.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
			.query('include=LineupID.UserLeagueID.UserID')
			.end(function(result){
				if(result.body.code) return done({code: 500, error: result.body});
				if(result.body.LineupID.UserLeagueID.UserID.objectId != req.user.objectId) return done({code:403});

				done();
			});
		}
	}, function(err, success){
		if(err && err.code && err.error) return res.status(err.code).send(err.error);
		if(err && err.code) return res.sendStatus(err.code);

		return res.sendStatus(200);
	});
};

module.exports = LineupPlayerController;