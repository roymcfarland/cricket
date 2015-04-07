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

module.exports = LineupPlayerController;