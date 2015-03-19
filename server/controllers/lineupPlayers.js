var superagent = require('superagent');
var Validatorjs = require('validatorjs');
var async = require('async');

var createRules = {
	user: 'objectId'
};

Validatorjs.register('objectId', function(value){
	if(!value || ! value.objectId) return false;
	if(value.objectId.match(/\W/g)) return false;

	return true;
}, 'The :attribute objectId must be included.');

var LineupPlayerController = function(){};

LineupPlayerController.prototype.create = function(req, res) {
	var validation = new Validatorjs(req.body, createRules);

	if(validation.fails()) return res.status(428).send({errors: validation.errors.all()});
};

module.exports = LineupPlayerController;