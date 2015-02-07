var express = require('express');

var app = express();

app.get('/rules', function(req, res) {
	var options = {
		root: __dirname + '../../config',
		dotfiles: 'deny'
	}
	res.sendFile('rules.json', options);
});

module.exports = app;