function webRoutes(app) {
	app.get('*', function(req, res) {
		var options = {
			root: __dirname + '../../../app/public',
			dotfiles: 'deny'
		}
		res.sendFile('index.html', options)
	});
}

module.exports = webRoutes;