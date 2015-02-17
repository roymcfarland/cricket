var should = require('should');
var cricketDuelConfig = require('../config/config');

describe('Checking the config file', function() {
	it('for the parse rest api keys', function() {
		cricketDuelConfig.parse.applicationId.should.be.exactly('GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD');
		cricketDuelConfig.parse.masterKey.should.be.exactly('oGHICAf2xBZIGcIpehCUoHgUrvFBGUAPLgOAp9Dc');
	});
});