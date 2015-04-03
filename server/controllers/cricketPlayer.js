var Validatorjs = require('validatorjs');

var CricketPlayerController = function(){};

CricketPlayerController.prototype.create = function(req, res) {
	var admin = req.user.admin;
	var validationRules = {
		name: 'required|alpha_num',
		team: 'required|alpha_num',
		cost: 'required|numeric',
		cricketPlayerTypeId: 'required|alpha_num'
	};
	var validation = new Validatorjs(req.body, validationRules);

	if(!admin) return res.sendStatus(403);
	if(validation.fails()) return res.status(428).send({errors: validation.errors.all()});
};

module.exports = CricketPlayerController;