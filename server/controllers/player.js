var superagent = require('superagent');

var PlayerController = function(){};

PlayerController.prototype.getAll = function(req, res) {
	superagent
		.get('https://api.parse.com/1/classes/CricketPlayer')
		.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
		.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
		.query('include=CricketPlayerType')
		.end(function(results){
			res.send({players: results.body.results});
		});
};

PlayerController.prototype.getOne = function(req, res) {
	var objectId = req.params.objectId;

	superagent
		.get('https://api.parse.com/1/classes/CricketPlayer/' + objectId)
		.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
		.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
		.query('include=CricketPlayerType')
		.end(function(result){
			res.send({player: result.body});
		});
};

module.exports = PlayerController;