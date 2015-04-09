var supertest = require('supertest');
var should = require('should');

var requestLocal = supertest('http://localhost:3000');
var requestParse = supertest('https://api.parse.com');
var adminUser;
var normalUser;
var testMatch;

describe('Preparing for the test', function(){
	describe('by creating', function(){
		it('an admin user', function(done){
			requestParse
				.post('/1/users')
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.send({
					username: 'testAdmin',
					password: 'password',
					email: 'testAdmin@latitude40.com',
					totalScore: 0,
					newUser: false,
					Money: 0,
					admin: true
				})
				.end(function(err, res){
					if(err) return done(err);

					adminUser = res.body;
					done();
				});
		});

		it('a normal user', function(done){
			requestParse
				.post('/1/users')
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.send({
					username: 'testUser',
					password: 'password',
					email: 'testUser@latitude40.com',
					totalScore: 0,
					newUser: false,
					Money: 0,
					admin: false
				})
				.end(function(err, res){
					if(err) return done(err);

					normalUser = res.body;
					done();
				});
		});
	});
});

describe('Sending a POST to /api/v1/matches', function(){
	describe('should fail validation', function(){
		it('when no Name is passed in', function(done){
			requestLocal
				.post('/api/v1/matches')
				.send({
					StartDateTime: new Date(),
					user: adminUser
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.key.should.be.exactly('Name');
					res.body.reason.should.be.exactly('Name is required.');
					done();
				});
		});

		it('when no StartDateTime is passed in', function(done){
			requestLocal
				.post('/api/v1/matches')
				.send({
					Name: 'testMatch',
					user: adminUser
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.key.should.be.exactly('StartDateTime');
					res.body.reason.should.be.exactly('Start date time is required.');
					done();
				});
		});
	});

	describe('should fail', function(){
		it('when the user is not an admin', function(done){
			requestLocal
				.post('/api/v1/matches')
				.send({
					Name: 'testMatch',
					StartDateTime: new Date(),
					user: normalUser
				})
				.expect(429)
				.end(done);
		});
	});

	describe('should succeed', function(){
		it('for a basic match', function(done){
			requestLocal
				.post('/api/v1/matches')
				.send({
					Name: 'testMatch',
					StartDateTime: new Date(),
					user: adminUser
				})
				.expect(201)
				.end(function(err, res){
					if(err) return done(err);

					res.body.objectId.should.be.type('string');
					res.body.createdAt.should.be.type('string');
					testMatch = res.body;
					done();
				});
		});
	});
});

describe('Sending a GET to /api/v1/matches', function(){
	describe('should succeed', function(){
		it('in getting all of the matches.', function(done){
			requestLocal
			.get('/api/v1/matches')
			.expect(200)
			.end(function(err, res){
				if(err) return done(err);
				if(res.body.code) return done(res.body);

				res.body[0].objectId.should.be.type('string');
				done();
			});
		});
	});
});

describe('Sending a GET to /api/v1/matches/:objectId', function(){
	describe('should succeed', function(){
		it('in getting one match.', function(done){
			requestLocal
			.get('/api/v1/matches/' + testMatch.objectId)
			.expect(200)
			.end(function(err, res){
				if(err) return done(err);
				if(res.body.code) return done(res.body);

				res.body.objectId.should.be.type('string');
				done();
			});
		});
	});
});

describe('Sending a PUT to /api/v1/matches/:objectId', function(){
	describe('should fail', function(){
		it('when the current user is not an admin.', function(done){
			requestLocal
			.put('/api/v1/matches/' + testMatch.objectId)
			.send({
				sessionToken: normalUser.sessionToken
			})
			.expect(403)
			.end(done);
		});
		it('when the Name is not alphanumeric.', function(done){
			requestLocal
			.put('/api/v1/matches/' + testMatch.objectId)
			.send({
				sessionToken: adminUser.sessionToken,
				Name: 'LJFG^%$#anrs'
			})
			.expect(428)
			.end(function(err, res){
				if(err) return done(err);

				res.body.errors.Name[0].should.be.exactly('The Name field must be alphanumeric.');
				done();
			});
		});
	});
	describe('should succeed', function(){
		after('Verifying that the match got updated on parse.', function(done){
			requestLocal
			.get('/api/v1/matches/' + testMatch.objectId)
			.end(function(err, res){
				if(err) return done(err);
				
				res.body.Name.should.be.exactly('updatedTestMatch');
				done();
			});
		});
		it('when updating a Match.', function(done){
			requestLocal
			.put('/api/v1/matches/' + testMatch.objectId)
			.send({
				sessionToken: adminUser.sessionToken,
				Name: 'updatedTestMatch'
			})
			.expect(200)
			.end(done);
		});
	});
});

describe('Cleaning up', function(){
	describe('the user', function(){
		it('adminUser', function(done){
			requestParse
				.del('/1/users/' + adminUser.objectId)
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.set('X-Parse-Session-Token', adminUser.sessionToken)
				.end(done);
		});

		it('normalUser', function(done){
			requestParse
				.del('/1/users/' + normalUser.objectId)
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.set('X-Parse-Session-Token', normalUser.sessionToken)
				.end(done);
		});
	});

	describe('the match', function(){
		it('testMatch', function(done){
			requestParse
				.del('/1/classes/Match/' + testMatch.objectId)
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.end(done);
		});
	});
});