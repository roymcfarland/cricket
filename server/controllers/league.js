var LeagueController = function(){};

LeagueController.prototype.create = function(req, res) {
	if('objectId' in req.body == false) return res.sendStatus(404);
};

module.exports = LeagueController;