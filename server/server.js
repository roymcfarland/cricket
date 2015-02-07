var express = require('express');
var webRoutes = require('./web-routes');
var dataRoutes = require('./data-routes');

var app = express();

app.use(express.static(__dirname + '/../app'));
app.use(dataRoutes);
app.use(webRoutes);

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
	console.log('Server running on port 3000');
});