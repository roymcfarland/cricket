var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(express.static(__dirname + '/../app/public'));
app.use(bodyParser());

var userRoutes = require('./routes/user')(app);
var rulesRoutes = require('./routes/rules')(app);
var webRoutes = require('./routes/web')(app);
var leagueRoutes = require('./routes/league')(app);

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
	console.log('Server running on port 3000');
});