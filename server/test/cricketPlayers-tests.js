var supertest = require('supertest');
var should = require('should');
var config = require('../config/config');

var requestParse = supertest('https://api.parse.com');
var requestLocal = supertest('http://localhost:3000');

var testCricketPlayerType;

describe('Preparing for the Cricket Player tests by creating', function(){
	it('a Cricket Player Type.', function(done){
		requestParse
			.post('/1/classes/CricketPlayerType')
			.set('X-Parse-Application-Id', config.parse.applicationId)
			.set('X-Parse-REST-API-Key', config.parse.apiKey)
			.send({
				name: 'testCricketPlayerType',
				lineUpMinimum: 0
			})
			.expect(201)
			.end(function(err, res){
				if(err) return done(err);
				if(res.body.code) return done(res.body);

				testCricketPlayerType = res.body;
				done();
			});
	});
});

describe('Cleaning up after the Cricket Player tests by deleting', function(){
	it('testCricketPlayerType.', function(done){
		requestParse
			.del('/1/classes/CricketPlayerType/' + testCricketPlayerType.objectId)
			.set('X-Parse-Application-Id', config.parse.applicationId)
			.set('X-Parse-REST-API-Key', config.parse.apiKey)
			.expect(200)
			.end(function(err, res){
				if(err) return done(err);
				if(res.body.code) return done(res.body);

				done();
			});
	});
});