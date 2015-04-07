var async = require('async');
var superagent = require('superagent');

var parseUrl = 'https://api.parse.com';

var MatchesController = function(){};

MatchesController.prototype.create = function(req, res) {
	var user = req.body.user;
	var Name = req.body.Name;
	var StartDateTime = req.body.StartDateTime;

	if(!user.sessionToken) return res.sendStatus(404);
	if(!Name) return res.status(428).send({key: 'Name', reason: 'Name is required.'});
	if(!StartDateTime) return res.status(428).send({key: 'StartDateTime', reason: 'Start date time is required.'});

	async.series({
		getCurrentUser: function(done){
			superagent
				.get(parseUrl + '/1/users/me')
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.set('X-Parse-Session-Token', user.sessionToken)
				.end(function(getCurrentUserResult){
					if(getCurrentUserResult.body.code){
						return done({
							code: 404
						});
					}
					if(!getCurrentUserResult.body.admin){
						return done({
							code: 429
						});
					}

					return done();
				});
		},
		createMatch: function(done){
			superagent
				.post(parseUrl + '/1/classes/Match')
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.send({
					Name: Name,
					StartDateTime: {
						__type: 'Date',
						iso: StartDateTime
					}
				})
				.end(function(createMatchResult){
					if(createMatchResult.body.code){
						return done({
							code: 500,
							message: createMatchResult.body
						});
					}
					return done(null, createMatchResult.body);
				});
		}
	}, function(err, result){
		if(err){
			if(err.code == 404) return res.sendStatus(404);
			if(err.code == 429) return res.sendStatus(429);
			if(err.code == 500) return res.status(500).send(err.message);
		}
		res.status(201).send(result.createMatch);
	});
};

MatchesController.prototype.getAll = function(req, res) {
	superagent
		.get('https://api.parse.com/1/classes/Match')
		.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
		.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
		.end(function(getAllMatchesResult){
			if(getAllMatchesResult.body.code) return res.status(500).send(getAllMatchesResult.body);

			return res.send(getAllMatchesResult.body.results);
		});
};

MatchesController.prototype.getOne = function(req, res) {
	superagent
	.get('https://api.parse.com/1/classes/Match/' + req.params.objectId)
	.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
	.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
	.end(function(getOneResult){
		if(getOneResult.body.code) return res.status(500).send(getOneResult.body);

		return res.send(getOneResult.body);
	});
};

module.exports = MatchesController;