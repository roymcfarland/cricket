var superagent = require('superagent');
var config = require('../config/config');

var protectGetRoutes = function(req, res, next){
	var sessionToken = req.query.sessionToken;

	if(!sessionToken) return res.sendStatus(430);

	superagent
		.get('https://api.parse.com/1/users/me')
		.set('X-Parse-Application-Id', config.parse.applicationId)
		.set('X-Parse-REST-API-Key', config.parse.apiKey)
		.set('X-Parse-Session-Token', sessionToken)
		.end(function(validateSessionTokenResult){
			if(validateSessionTokenResult.body.code) return res.sendStatus(404);

			req.user = validateSessionTokenResult.body;
			next();
		});
};

module.exports = protectGetRoutes;