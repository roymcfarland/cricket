var supertest = require('supertest');
var should = require('should');
var config = require('../config/config');

var userOneId;
var userTwoId;
var sessionToken;
var request;

describe('Creating test users', function() {
	it('creating new user on Parse', function(done) {
		request = supertest('https://api.parse.com');

		request
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
				userOneId = res.body.objectId;
				sessionToken = res.body.sessionToken;
				done();
			});
	});

	it('creating new user (with newUser field set to false)', function(done) {
		request = supertest('https://api.parse.com');

		request
			.post('/1/users')
			.set('Content-Type', 'application/json')
			.set('X-Parse-Application-Id', config.parse.applicationId)
			.set('X-Parse-Master-Key', config.parse.masterKey)
			.send({
				"username": "test2",
				"password": "password",
				"email": "test2@latitude40.com",
				"newUser": false
			})
			.expect(201)
			.end(function(err, res) {
				if(err) return done(err);

				res.body.createdAt.should.have.type('string');
				res.body.objectId.should.have.type('string');
				res.body.sessionToken.should.have.type('string');
				userTwoId = res.body.objectId;
				sessionToken = res.body.sessionToken;
				done();
			});
	});
});

describe('Populating new users with default stats by sending a POST to /api/users/<objectId', function() {
	it('Should return a 512 error if no such user can be found', function(done) {
		request = supertest('http://localhost:3000');

		request
			.post('/api/users/nosuchid')
			.expect(512)
			.end(done);
	});

	it('Should return a 514 error if the user is not new', function(done) {
		request = supertest('http://localhost:3000');

		request
			.post('/api/users/' + userTwoId) //Darth Vader
			.expect(514)
			.end(done);
	});
});

describe('Removing the test user from Parse', function() {
	it('Removind the test user', function(done) {
		request = supertest('https://api.parse.com');

		request
			.del('/1/users/' + userOneId)
			.set('X-Parse-Application-Id', config.parse.applicationId)
			.set('X-Parse-Master-Key', config.parse.masterKey)
			.set('X-Parse-Session-Token', sessionToken)
			.expect(200)
			.end(done)
	});

	it('Removind the second user', function(done) {
		request = supertest('https://api.parse.com');

		request
			.del('/1/users/' + userTwoId)
			.set('X-Parse-Application-Id', config.parse.applicationId)
			.set('X-Parse-Master-Key', config.parse.masterKey)
			.set('X-Parse-Session-Token', sessionToken)
			.expect(200)
			.end(done)
	});
});