var supertest = require('supertest');
var config = require('../config/config');

var requestLocal = supertest('http://localhost:3000');
var requestParse = supertest('https://api.parse.com');
var testUser;
var testAdmin;

describe('Preparing for the Cricket Player Type tests by creating a', function(){
	it('testUser.', function(done){
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
	it('a testAdmin.', function(done){
		requestParse
			.post('/1/users')
			.set('X-Parse-Application-Id', config.parse.applicationId)
			.set('X-Parse-REST-API-Key', config.parse.apiKey)
			.send({
				username: 'testAdmin',
				password: 'password',
				email: 'testAdmin@latitude40.com',
				totalScore: 0,
				Money: 0,
				admin: true
			})
			.expect(201)
			.end(function(err, res){
				if(err) return done(err);
				if(res.body.code) return done(res.body);

				testAdmin = res.body;
				done();
			});
	});
});

describe('Sending a POST to /api/v1/cricketPlayerTypes', function(){
	describe('should fail', function(){
		it('when a normal user tries to create a cricket player type.', function(done){
			requestLocal
				.post('/api/v1/cricketPlayerTypes')
				.send({
					sessionToken: testUser.sessionToken,
					name: 'testCricketPlayerType',
					lineUpMinimum: 2
				})
				.expect(403)
				.end(done);
		});
		it('when the name is not passed in.', function(done){
			requestLocal
				.post('/api/v1/cricketPlayerTypes')
				.send({
					sessionToken: testAdmin.sessionToken,
					// name: 'testCricketPlayerType',
					lineUpMinimum: 2
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.name[0].should.be.exactly('The name field is required.');
					done();
				});
		});
		it('when the lineUpMinimum is not passed in.', function(done){
			requestLocal
				.post('/api/v1/cricketPlayerTypes')
				.send({
					sessionToken: testAdmin.sessionToken,
					name: 'testCricketPlayerType',
					// lineUpMinimum: 2
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.lineUpMinimum[0].should.be.exactly('The lineUpMinimum field is required.');
					done();
				});
		});
		it('when the name is not alphanumeric.', function(done){
			requestLocal
				.post('/api/v1/cricketPlayerTypes')
				.send({
					sessionToken: testAdmin.sessionToken,
					name: 'ayurlstjg^&%$',
					// name: 'testCricketPlayerType',
					lineUpMinimum: 2
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.name[0].should.be.exactly('The name field must be alphanumeric.');
					done();
				});
		});
		it('when the lineUpMinimum is not a number.', function(done){
			requestLocal
				.post('/api/v1/cricketPlayerTypes')
				.send({
					sessionToken: testAdmin.sessionToken,
					name: 'testCricketPlayerType',
					lineUpMinimum: 'aioestnr'
					// lineUpMinimum: 2
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.lineUpMinimum[0].should.be.exactly('The lineUpMinimum must be a number.');
					done();
				});
		});
	});
});

describe('Cleaning up after the Cricket Player Type tests by deleting the', function(){
	it('testUser.', function(done){
		requestLocal
			.del('/api/v1/users/' + testUser.objectId)
			.send({
				sessionToken: testUser.sessionToken
			})
			.expect(200)
			.end(done);
	});
	it('testAdmin.', function(done){
		requestLocal
			.del('/api/v1/users/' + testAdmin.objectId)
			.send({
				sessionToken: testAdmin.sessionToken
			})
			.expect(200)
			.end(done);
	});
});