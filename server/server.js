var express = require('express');

var app = express();

app.use(express.static(__dirname + '/../app'));

var server = app.listen(3000, function() {
	console.log('Server running on port 3000');
});