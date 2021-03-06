var supertest = require('supertest');
var config = require('../config/config');

var testUser;
var testLeague;
var testLeagueWithCustomRules;
var testLeagueWithCustomNestedRules;

var requestLocal = supertest('http://localhost:3000');
var requestParse = supertest('https://api.parse.com');

describe('Creating the test user', function(){
	it('creating new user on Parse', function(done) {
		requestParse
			.post('/1/users')
			.set('Content-Type', 'application/json')
			.set('X-Parse-Application-Id', config.parse.applicationId)
			.set('X-Parse-Master-Key', config.parse.masterKey)
			.send({
				"username": "test",
				"password": "password",
				"email": "brooks.patton@latitude40.com",
				"newUser": true
			})
			.expect(201)
			.end(function(err, res) {
				if(err) return done(err);

				res.body.createdAt.should.have.type('string');
				res.body.objectId.should.have.type('string');
				res.body.sessionToken.should.have.type('string');
				testUser = res.body.objectId;
				done();
			});
	});

	it('Should give the user defaults', function(done) {
		request = supertest('http://localhost:3000');

		request
			.post('/api/users/' + testUser)
			.expect(200)
			.end(done);
	});
});

describe('Creating a new league', function(){
	it('should return a 404 when the user id is not provided', function(done){
		requestLocal
			.post('/api/leagues')
			.expect(404)
			.end(done);
	});

	it('should return a 404 when the user id does not correspond to a user on parse', function(done) {
		requestLocal
			.post('/api/leagues')
			.send({
				objectId: 'notreal',
				name: 'not a real name'
			})
			.expect(404)
			.end(done);
	});

	it('should return a 515 error when no name is sent', function(done){
		requestLocal
			.post('/api/leagues')
			.send({
				objectId: 'notreal'
			})
			.expect(515)
			.end(done);
	});

	it('should create a league on parse with default rules', function(done){
		requestLocal
			.post('/api/leagues')
			.send({
				objectId: testUser,
				name: 'test league'
			})
			.expect(200)
			.end(function(err, res){
				if(err) return done(err);

				testLeague = res.body.objectId;
				done();
			});
	});

	describe('Creating a league with custom rules', function(){
		it('should fail when a rule is added instead of modified', function(done){
			requestLocal
				.post('/api/leagues')
				.send({
					objectId: testUser,
					name: 'Custom rules league',
					rules: [
						['newKey', 'newValue']
					]
				})
				.expect(517)
				.end(function(err, res){
					if(err) return done(err);

					done();
				});
		});

		it('should succeed when a rule is modified', function(done){
			requestLocal
				.post('/api/leagues')
				.send({
					objectId: testUser,
					name: 'Custom rules league',
					rules: [
						['moneyToCreateTeam', 5]
					]
				})
				.expect(200)
				.end(function(err, res){
					if(err) return done(err);

					testLeagueWithCustomRules = res.body.objectId;
					done();
				});
		});

		it('should succeed when a nested rule is modified', function(done){
			requestLocal
				.post('/api/leagues')
				.send({
					objectId: testUser,
					name: 'Custom rules league',
					rules: [
						['transfers.phase1', 23]
					]
				})
				.expect(200)
				.end(function(err, res){
					if(err) return done(err);

					testLeagueWithCustomNestedRules = res.body.objectId;
					done();
				});
		});
	});
});

describe('Cleaning up', function(){
	it('by removing the test user', function(done) {
		request = supertest('https://api.parse.com');

		request
			.del('/1/users/' + testUser)
			.set('X-Parse-Application-Id', config.parse.applicationId)
			.set('X-Parse-Master-Key', config.parse.masterKey)
			.expect(200)
			.end(done)
	});

	it('by removing the test league', function(done) {
		requestParse
			.del('/1/classes/League/' + testLeague)
			.set('X-Parse-Application-Id', config.parse.applicationId)
			.set('X-Parse-Master-Key', config.parse.masterKey)
			.expect(200)
			.end(done);
	});

	it('by removing the test league with custom rules', function(done) {
		requestParse
			.del('/1/classes/League/' + testLeagueWithCustomRules)
			.set('X-Parse-Application-Id', config.parse.applicationId)
			.set('X-Parse-Master-Key', config.parse.masterKey)
			.expect(200)
			.end(done);
	});

	it('by removing the test league with custom nested rules', function(done) {
		requestParse
			.del('/1/classes/League/' + testLeagueWithCustomNestedRules)
			.set('X-Parse-Application-Id', config.parse.applicationId)
			.set('X-Parse-Master-Key', config.parse.masterKey)
			.expect(200)
			.end(done);
	});
});