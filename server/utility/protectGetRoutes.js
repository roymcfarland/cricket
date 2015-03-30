var superagent = require('superagent');
var Validatorjs = require('validatorjs');
var config = require('../config/config');

var protectGetRoutes = function(req, res, next){
	var sessionToken = req.query.sessionToken;
	var rules = {
		sessionToken: 'alpha_num'
	};
	var validation = new Validatorjs(req.query, rules);

	if(!sessionToken) return res.sendStatus(430);
	if(validation.fails()) return res.status(428).send({errors: validation.errors.all()});

	superagent
		.get('https://api.parse.com/1/users/me')
		.set('X-Parse-Application-Id', config.parse.applicationId)
		.set('X-Parse-REST-API-Key', config.parse.apiKey)
		.set('X-Parse-Session-Token', sessionToken)
		.end(function(validateSessionTokenResult){
			if(validateSessionTokenResult.body.code) return res.status(500).send(validateSessionTokenResult.body);

			req.user = validateSessionTokenResult.body;
			next();
		});
};

module.exports = protectGetRoutes;