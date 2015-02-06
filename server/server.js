var express = require('express');
var webRoutes = require('./web-routes');

var app = express();

// app.get('/', function(req, res) {
// 	res.sendFile('../../../public/index.html')
// });

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
	console.log('Server running on port 3000');
});