var Validatorjs = require('validatorjs');

var CricketPlayerTypeController = function(){};

CricketPlayerTypeController.prototype.create = function(req, res) {
	var admin = req.user.admin;

	if(!admin) return res.sendStatus(403);

	var validationRules = {
		name: 'required'
	};
	var validation = new Validatorjs(req.body, validationRules);

	if(validation.fails()) return res.status(428).send({errors: validation.errors.all()});
};

module.exports = CricketPlayerTypeController;