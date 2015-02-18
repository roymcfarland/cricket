function rulesRoutes(app) {
	app.get('/api/rules', function(req, res) {
		var options = {
			root: __dirname + '../../config',
			dotfiles: 'deny'
		}
		res.sendFile('rules.json', options);
	});
}

module.exports = rulesRoutes;