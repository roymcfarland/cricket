var express = require('express');
var webRoutes = require('./web-routes');

var app = express();

app.use(express.static(__dirname + '/../app'));
app.use(webRoutes);

var server = app.listen(3000, function() {
	console.log('Server running on port 3000');
});