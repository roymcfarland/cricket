var superagent = require('superagent');

var PlayerController = function(){};

PlayerController.prototype.getAll = function(req, res) {
	superagent
		.get('https://api.parse.com/1/classes/CricketPlayer')
		.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
		.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
		.end(function(results){
			console.log(results.body);
			res.send(results.body);
		});
};

module.exports = PlayerController;