var Validatorjs = require('validatorjs');
var superagent = require('superagent');
var config = require('../config/config');

var getAllRules = {
	leagueId: 'alpha_num',
	userId: 'alpha_num'
};

var UserLeagueController = function(){};

UserLeagueController.prototype.getAll = function(req, res) {
	var validation = new Validatorjs(req.query, getAllRules);

	if(validation.fails()) return res.status(428).send({errors: validation.errors.all()});

	if(!req.user.admin) return res.sendStatus(403);
	
	superagent
		.get('https://api.parse.com/1/classes/UserLeague')
		.set('X-Parse-Application-Id', config.parse.applicationId)
		.set('X-Parse-REST-API-Key', config.parse.apiKey)
		.query('include=LeagueID,UserID')
		.end(function(getAllResults){
			if(getAllResults.body.code) return res.status(500).send(getAllResults.body);

			return res.send(getAllResults.body.results);
		});
};

module.exports = UserLeagueController;