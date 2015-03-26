var Validatorjs = require('validatorjs');

var getAllRules = {
	leagueId: 'alpha_num'
};

var UserLeagueController = function(){};

UserLeagueController.prototype.getAll = function(req, res) {
	var validation = new Validatorjs(req.query, getAllRules);

	if(validation.fails()) return res.status(428).send({errors: validation.errors.all()});
	return res.sendStatus(123);
};

module.exports = UserLeagueController;