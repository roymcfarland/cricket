var superagent = require('superagent');
var Validatorjs = require('validatorjs');
var async = require('async');

var createRules = {
	user: 'objectId|sessionToken',
	LineupID: 'required|alpha_num',
	CricketPlayerID: 'required|alpha_num'
};

Validatorjs.register('objectId', function(value){
	if(!value || !value.objectId) return false;
	if(value.objectId.match(/\W/g)) return false;

	return true;
}, 'The :attribute objectId must be included.');

Validatorjs.register('sessionToken', function(value){
	if(!value || !value.sessionToken) return false;
	if(value.sessionToken.match(/\W/g)) return false;

	return true;
}, 'The :attribute sessionToken must be included.');

var LineupPlayerController = function(){};

LineupPlayerController.prototype.create = function(req, res) {
	var validation = new Validatorjs(req.body, createRules);

	if(validation.fails()) return res.status(428).send({errors: validation.errors.all()});
};

module.exports = LineupPlayerController;