var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(express.static(__dirname + '/../app/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var userRoutes = require('./routes/user')(app);
var rulesRoutes = require('./routes/rules')(app);
var leagueRoutes = require('./routes/league')(app);
var playersRoutes = require('./routes/players')(app);
var matchRoutes = require('./routes/matches')(app);
var webRoutes = require('./routes/web')(app);

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
	console.log('Server running on port 3000');
});
