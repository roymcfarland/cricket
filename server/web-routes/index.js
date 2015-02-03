var express = require('express');

var app = express();

app.get('*', function(req, res) {
	var options = {
		root: __dirname + '../../../app/views/',
		dotfiles: 'deny'
	}
	res.sendFile('index.html', options)
});

module.exports = app;