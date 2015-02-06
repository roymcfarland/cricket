var express = require('express');
var webRoutes = require('./web-routes');
//var angular = require('angular');

var app = express();

console.log('************');
console.log(__dirname);
console.log('************');

app.use(express.static(__dirname + '/../app/public'));
// app.use(webRoutes);

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
	console.log('Server running on port 3000');
});