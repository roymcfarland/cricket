var supertest = require('supertest');
var should = require('should');
var config = require('../config/config');

var requestParse = supertest('https://api.parse.com');
var testUser;
var testLeague;
var requestLocal = supertest('http://localhost:3000');
var testUserLeague;

describe('Preparing for the user league tests', function(){
	describe('by creating a', function(){
		it('testUser.', function(done){
			requestParse
			.post('/1/users')
			.set('X-Parse-Application-Id', config.parse.applicationId)
			.set('X-Parse-REST-API-Key', config.parse.apiKey)
			.send({
				username: 'testUser',
				password: 'password',
				email: 'testUser@latitude40.com',
				totalScore: 0,
				Money: 0,
				admin: false
			})
			.expect(201)
			.end(function(err, res){
				if(err) return done(err);
				if(res.body.code) return done(res.body);

				testUser = res.body;
				done();
			});
		});
		it('testLeague.', function(done){
			requestParse
			.post('/1/classes/League')
			.set('X-Parse-Application-Id', config.parse.applicationId)
			.set('X-Parse-REST-API-Key', config.parse.apiKey)
			.send({
				entryFee: 5,
				guaranteedPrize: 1,
				maxEntries: 1,
				multiEntry: false,
				name: 'testLeague',
				noOfEntries: 0,
				totalScore: 0,
				winningPrize: 25,
				owner: {
					__type: 'Pointer',
					className: '_User',
					objectId: testUser.objectId
				}
			})
			.expect(201)
			.end(function(err, res){
				if(err) return done(err);
				if(res.body.code) return done(res.body);

				testLeague = res.body;
				done();
			});
		});
	});
});

describe('Sending a POST to /api/v1/userLeagues', function(){
	describe('should fail', function(){
		it('when the LeagueID is not passed in.', function(done){
			requestLocal
			.post('/api/v1/userLeagues')
			.send({
				sessionToken: testUser.sessionToken,
				// LeagueID: testLeague.objectId,
				UserID: testUser.objectId
			})
			.expect(428)
			.end(function(err, res){
				if(err) return done(err);

				res.body.errors.LeagueID[0].should.be.exactly('The LeagueID field is required.');
				done();
			});
		});
		it('when the LeagueID is not alphanumeric.', function(done){
			requestLocal
			.post('/api/v1/userLeagues')
			.send({
				sessionToken: testUser.sessionToken,
				LeagueID: 'testLeague.objectId',
				UserID: testUser.objectId
			})
			.expect(428)
			.end(function(err, res){
				if(err) return done(err);

				res.body.errors.LeagueID[0].should.be.exactly('The LeagueID field must be alphanumeric.');
				done();
			});
		});
	});
	describe('should succeed', function(){
		it('in creating a userLeague.', function(done){
			requestLocal
			.post('/api/v1/userLeagues')
			.send({
				sessionToken: testUser.sessionToken,
				LeagueID: testLeague.objectId
			})
			.expect(201)
			.end(function(err, res){
				if(err) return done(err);

				res.body.objectId.should.be.type('string');
				testUserLeague = res.body;
				done();
			});
		});
	});
});

describe('Sending a GET to /api/v1/userLeagues/:objectId', function(){
	describe('should succeed', function(){
		it('in getting one user league.', function(done){
			requestLocal
			.get('/api/v1/userLeagues/' + testUserLeague.objectId)
			.query('sessionToken=' + testUser.sessionToken)
			.expect(200)
			.end(function(err, res){
				if(err) return done(err);
				if(res.body.code) return done(res.body);

				res.body.objectId.should.be.exactly(testUserLeague.objectId);
				res.body.LeagueID.name.should.be.exactly('testLeague');
				res.body.UserID.username.should.be.exactly('testUser');
				done();
			});
		});
	});
});

describe('Cleaning up after the user league tests', function(){
	describe('by deleting', function(){
		it('testLeague.', function(done){
			requestParse
			.del('/1/classes/League/' + testLeague.objectId)
			.set('X-Parse-Application-Id', config.parse.applicationId)
			.set('X-Parse-REST-API-Key', config.parse.apiKey)
			.end(function(err, res){
				if(err) return done(err);
				if(res.body.code) return done(res.body);

				done();
			});
		});
		it('testUser.', function(done){
			requestParse
			.del('/1/users/' + testUser.objectId)
			.set('X-Parse-Application-Id', config.parse.applicationId)
			.set('X-Parse-REST-API-Key', config.parse.apiKey)
			.set('X-Parse-Session-Token', testUser.sessionToken)
			.end(function(err, res){
				if(err) return done(err);
				if(res.body.code) return done(res.body);

				done();
			});
		});
	});
});