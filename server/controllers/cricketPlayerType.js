var CricketPlayerTypeController = function(){};

CricketPlayerTypeController.prototype.create = function(req, res) {
	var admin = req.user.admin;

	if(!admin) return res.sendStatus(403);
};

module.exports = CricketPlayerTypeController;