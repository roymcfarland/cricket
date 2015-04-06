var superagent = require('superagent');
var Validatorjs = require('validatorjs');
var async = require('async');

var LineupController = function(){};

var createRules = {
	UserLeagueId: 'required|alpha_num',
	MatchID: 'alpha_num',
	Locked: 'boolean'
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
	.query('include=UserLeagueID.UserID')
	.end(function(getAllResults){
		if(getAllResults.body.code) return res.status(500).send(getAllResults.body);

		return res.send(getAllResults.body.results);
	});
};

module.exports = LineupController;