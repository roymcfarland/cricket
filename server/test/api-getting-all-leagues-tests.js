var supertest = require('supertest');
var should = require('should');
var config = require('../config/config');

var requestLocal = supertest('http://localhost:3000');
var requestParse = supertest('https://api.parse.com');
var userId;
var user2Id;
var leagueId;
var league2Id;

describe('Creating a test User', function(){
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
				userId = res.body.objectId;
				done();
			});
	});

	it('Should give the user defaults', function(done) {
		requestLocal
			.post('/api/users/' + userId)
			.expect(200)
			.end(done);
	});
});

describe('Creating a second test User', function(){
	it('creating new user on Parse', function(done) {
		requestParse
			.post('/1/users')
			.set('Content-Type', 'application/json')
			.set('X-Parse-Application-Id', config.parse.applicationId)
			.set('X-Parse-Master-Key', config.parse.masterKey)
			.send({
				"username": "test2",
				"password": "password",
				"email": "test2@latitude40.com",
				"newUser": true
			})
			.expect(201)
			.end(function(err, res) {
				if(err) return done(err);

				res.body.createdAt.should.have.type('string');
				res.body.objectId.should.have.type('string');
				res.body.sessionToken.should.have.type('string');
				user2Id = res.body.objectId;
				done();
			});
	});

	it('Should give the user defaults', function(done) {
		requestLocal
			.post('/api/users/' + user2Id)
			.expect(200)
			.end(done);
	});
});

describe('Creating a test league', function(){
	it('should create a league on parse with default rules', function(done){
		requestLocal
			.post('/api/leagues')
			.send({
				objectId: userId,
				name: 'test league'
			})
			.expect(200)
			.end(function(err, res){
				if(err) return done(err);

				leagueId = res.body.objectId;
				done();
			});
	});
});

describe('Creating a second test league', function(){
	it('should create a league on parse with default rules', function(done){
		requestLocal
			.post('/api/leagues')
			.send({
				objectId: user2Id,
				name: 'test league'
			})
			.expect(200)
			.end(function(err, res){
				if(err) return done(err);

				league2Id = res.body.objectId;
				done();
			});
	});
});

describe('Getting all leagues owned by the user', function(){
	it('should fail if no object id is passed in', function(done){
		requestLocal
			.get('/api/leagues?owner=true')
			.expect(427)
			.end(done);
	});

	it('should fail if an empty object id is passed in', function(done){
		requestLocal
			.get('/api/leagues?owner=true&objectId=')
			.expect(427)
			.end(done);
	});

	it('should return a list of leagues that the user owns', function(done){
		requestLocal
			.get('/api/leagues?owner=true&objectId=' + userId)
			.expect(200)
			.end(function(err, res){
				if(err) return done(err);

				res.body.length.should.be.exactly(1);
				res.body[0].objectId.should.be.exactly(leagueId);
				res.body[0].totalScore.should.be.exactly(0);
				res.body[0].name.should.be.exactly('test league');
				res.body[0].owner.should.be.exactly(userId);
				res.body[0].rules.should.be.type('object');
				done();
			});
	});
});

describe('Getting all of the leagues', function(){
	it('should be able to get an array of all leagues', function(done){
		requestLocal
			.get('/api/leagues')
			.expect(200)
			.end(function(err, res){
				if(err) return done(err);

				res.body.length.should.be.exactly(2);
				res.body[0].owner.should.be.exactly(userId || user2Id);
				done();
			});
	});
});

describe('Cleaning up', function(){
	it('by removing the test user', function(done) {
		request = supertest('https://api.parse.com');

		request
			.del('/1/users/' + userId)
			.set('X-Parse-Application-Id', config.parse.applicationId)
			.set('X-Parse-Master-Key', config.parse.masterKey)
			.expect(200)
			.end(done)
	});

	it('by removing the second test user', function(done) {
		request = supertest('https://api.parse.com');

		request
			.del('/1/users/' + user2Id)
			.set('X-Parse-Application-Id', config.parse.applicationId)
			.set('X-Parse-Master-Key', config.parse.masterKey)
			.expect(200)
			.end(done)
	});

	it('by removing the test league', function(done) {
		requestParse
			.del('/1/classes/League/' + leagueId)
			.set('X-Parse-Application-Id', config.parse.applicationId)
			.set('X-Parse-Master-Key', config.parse.masterKey)
			.expect(200)
			.end(done);
	});

	it('by removing the second test league', function(done) {
		requestParse
			.del('/1/classes/League/' + league2Id)
			.set('X-Parse-Application-Id', config.parse.applicationId)
			.set('X-Parse-Master-Key', config.parse.masterKey)
			.expect(200)
			.end(done);
	});
});