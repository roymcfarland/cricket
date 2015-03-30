var supertest = require('supertest');
var should = require('should');

var requestLocal = supertest('http://localhost:3000');
var requestParse = supertest('https://api.parse.com');

var testUser;

describe('Sending a POST to /api/v1/users', function(){
	describe('should fail', function(){
		it('when the username is not passed in.', function(done){
			requestLocal
				.post('/api/v1/users')
				.send({
					// username: 'testuser',
					password: 'password',
					email: 'testuser@latitude40.com'
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.username[0].should.be.exactly('The username field is required.');
					done();
				});
		});

		it('when the username is not alphanumeric.', function(done){
			requestLocal
				.post('/api/v1/users')
				.send({
					username: '00asnet=',
					// username: 'testuser',
					password: 'password',
					email: 'testuser@latitude40.com'
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.username[0].should.be.exactly('The username field must be alphanumeric.');
					done();
				});
		});

		it('when the password is not passed in.', function(done){
			requestLocal
				.post('/api/v1/users')
				.send({
					username: 'testuser',
					// password: 'password',
					email: 'testuser@latitude40.com'
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.password[0].should.be.exactly('The password field is required.');
					done();
				});
		});

		it('when the email is not passed in.', function(done){
			requestLocal
				.post('/api/v1/users')
				.send({
					username: 'testuser',
					password: 'password',
					// email: 'testuser@latitude40.com'
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.email[0].should.be.exactly('The email field is required.');
					done();
				});
		});

		it('when the email is not a valid email.', function(done){
			requestLocal
				.post('/api/v1/users')
				.send({
					username: 'testuser',
					password: 'password',
					email: 'aaa'
					// email: 'testuser@latitude40.com'
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.email[0].should.be.exactly('The email format is invalid.');
					done();
				});
		});
	});
	describe('should succeed', function(){
		it('when the correct information is passed in.', function(done){
			requestLocal
				.post('/api/v1/users')
				.send({
					username: 'testuser',
					password: 'password',
					email: 'testuser@latitude40.com'
				})
				.expect(201)
				.end(function(err, res){
					if(err) return done(err);

					res.body.objectId.should.be.type('string');
					testUser = res.body;
					done();
				});
			});
	});
});

describe('Sending a GET to /api/v1/users', function(){
	describe('should succeed', function(){
		it('when the correct user token is passed in.', function(done){
			requestLocal
				.get('/api/v1/users')
				.query('sessionToken=' + testUser.sessionToken)
				.expect(200)
				.end(function(err, res){
					if(err) return done(err);
					if(res.body.code) return done(res.body.code);

					res.body.users[0].objectId.should.be.type('string');
					done();
				});
		});
	});
});

describe('Sending a GET to /api/v1/users/:objectId', function(){
	describe('should succeed', function(){
		it('when getting a test user.', function(done){
			requestLocal
				.get('/api/v1/users/' + testUser.objectId + '?sessionToken=' + testUser.sessionToken)
				.expect(200)
				.end(function(err, res){
					if(err) return done(err);
					if(res.body.code) return done(res.body.code);

					res.body.user.objectId.should.be.type('string');
					done();
				});
		});
	});
});