var supertest = require('supertest');
var should = require('should');
var _ = require('underscore');
var config = require('../config/config');

var requestParse = supertest('https://api.parse.com');
var requestLocal = supertest('http://localhost:3000');

var testCricketPlayerType;
var testUser;
var testAdmin;
var testCricketPlayer;

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
	it('a testUser.', function(done){
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

describe('Sending a POST to /api/v1/cricketPlayers', function(){
	describe('should fail', function(){
		it('when the current user is not an admin.', function(done){
			requestLocal
				.post('/api/v1/cricketPlayers')
				.send({
					sessionToken: testUser.sessionToken
				})
				.expect(403)
				.end(done);
		});
		it('when the name is not included.', function(done){
			requestLocal
				.post('/api/v1/cricketPlayers')
				.send({
					sessionToken: testAdmin.sessionToken,
					// name: 'testCricketPlayer',
					team: 'testCricketPlayerTeam',
					cost: 9000,
					cricketPlayerTypeId: testCricketPlayerType.objectId
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.name[0].should.be.exactly('The name field is required.');
					done();
				});
		});
		it('when the team is not included.', function(done){
			requestLocal
				.post('/api/v1/cricketPlayers')
				.send({
					sessionToken: testAdmin.sessionToken,
					name: 'testCricketPlayer',
					// team: 'testCricketPlayerTeam',
					cost: 9000,
					cricketPlayerTypeId: testCricketPlayerType.objectId
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.team[0].should.be.exactly('The team field is required.');
					done();
				});
		});
		it('when the cost is not included.', function(done){
			requestLocal
				.post('/api/v1/cricketPlayers')
				.send({
					sessionToken: testAdmin.sessionToken,
					name: 'testCricketPlayer',
					team: 'testCricketPlayerTeam',
					// cost: 9000,
					cricketPlayerTypeId: testCricketPlayerType.objectId
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.cost[0].should.be.exactly('The cost field is required.');
					done();
				});
		});
		it('when the cricketPlayerTypeId is not included.', function(done){
			requestLocal
				.post('/api/v1/cricketPlayers')
				.send({
					sessionToken: testAdmin.sessionToken,
					name: 'testCricketPlayer',
					team: 'testCricketPlayerTeam',
					cost: 9000,
					// cricketPlayerTypeId: testCricketPlayerType.objectId
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.cricketPlayerTypeId[0].should.be.exactly('The cricketPlayerTypeId field is required.');
					done();
				});
		});
		it('when the name is not alphanumeric.', function(done){
			requestLocal
				.post('/api/v1/cricketPlayers')
				.send({
					sessionToken: testAdmin.sessionToken,
					name: 'ry876092&^%T',
					// name: 'testCricketPlayer',
					team: 'testCricketPlayerTeam',
					cost: 9000,
					cricketPlayerTypeId: testCricketPlayerType.objectId
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.name[0].should.be.exactly('The name field must be alphanumeric.');
					done();
				});
		});
		it('when the team is not alphanumeric.', function(done){
			requestLocal
				.post('/api/v1/cricketPlayers')
				.send({
					sessionToken: testAdmin.sessionToken,
					name: 'testCricketPlayer',
					team: 'argLJGF%$',
					// team: 'testCricketPlayerTeam',
					cost: 9000,
					cricketPlayerTypeId: testCricketPlayerType.objectId
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.team[0].should.be.exactly('The team field must be alphanumeric.');
					done();
				});
		});
		it('when the cost is not numeric.', function(done){
			requestLocal
				.post('/api/v1/cricketPlayers')
				.send({
					sessionToken: testAdmin.sessionToken,
					name: 'testCricketPlayer',
					team: 'testCricketPlayerTeam',
					cost: 'ayurs7t',
					// cost: 9000,
					cricketPlayerTypeId: testCricketPlayerType.objectId
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.cost[0].should.be.exactly('The cost must be a number.');
					done();
				});
		});
		it('when the cricketPlayerTypeId is not alphanumeric.', function(done){
			requestLocal
				.post('/api/v1/cricketPlayers')
				.send({
					sessionToken: testAdmin.sessionToken,
					name: 'testCricketPlayer',
					team: 'testCricketPlayerTeam',
					cost: 9000,
					cricketPlayerTypeId: 'aeisrtluj654#%$'
					// cricketPlayerTypeId: testCricketPlayerType.objectId
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.cricketPlayerTypeId[0].should.be.exactly('The cricketPlayerTypeId field must be alphanumeric.');
					done();
				});
		});
	});
	describe('should succeed', function(){
		it('when creating a testCricketPlayer', function(done){
			requestLocal
				.post('/api/v1/cricketPlayers')
				.send({
					sessionToken: testAdmin.sessionToken,
					name: 'testCricketPlayer',
					team: 'testCricketPlayerTeam',
					cost: 9000,
					cricketPlayerTypeId: testCricketPlayerType.objectId
				})
				.expect(201)
				.end(function(err, res){
					if(err) return done(err);
					if(res.body.code) return done(res.body);
					
					res.body.objectId.should.be.type('string');
					testCricketPlayer = res.body;
					done();
				});
		});
	});
});

describe('Sending a GET to /api/v1/cricketPlayers', function(){
	describe('should succeed', function(){
		it('in getting all cricket players.', function(done){
			requestLocal
				.get('/api/v1/cricketPlayers')
				.expect(200)
				.end(function(err, res){
					if(err) return done(err);
					if(res.body.code) return done(res.body);

					var cricketPlayer = _.findWhere(res.body, {objectId: testCricketPlayer.objectId});
					cricketPlayer.objectId.should.be.exactly(testCricketPlayer.objectId);
					cricketPlayer.name.should.be.exactly('testCricketPlayer');
					cricketPlayer.team.should.be.exactly('testCricketPlayerTeam');
					cricketPlayer.cost.should.be.exactly(9000);
					cricketPlayer.CricketPlayerTypeID.name.should.be.exactly('testCricketPlayerType');
					done();
				});
		});
	});
});

describe('Sending a GET to /api/v1/cricketPlayers/:objectId', function(){
	describe('should fail', function(){
		it('when the objectId is not alphanumeric.', function(done){
			requestLocal
				.get('/api/v1/cricketPlayers/iaetnrdh$')
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.objectId[0].should.be.exactly('The objectId field must be alphanumeric.');
					done();
				});
		});
		it('when the player is not found.', function(done){
			requestLocal
				.get('/api/v1/cricketPlayers/notARealObjectId')
				.expect(404)
				.end(done);
		});
	});
	describe('should succeed', function(){
		it('when getting the testCricketPlayer.', function(done){
			requestLocal
				.get('/api/v1/cricketPlayers/' + testCricketPlayer.objectId)
				.expect(200)
				.end(function(err, res){
					if(err) return done(err);
					if(res.body.code) return done(res.body);

					res.body.name.should.be.exactly('testCricketPlayer');
					res.body.team.should.be.exactly('testCricketPlayerTeam');
					res.body.cost.should.be.exactly(9000);
					res.body.CricketPlayerTypeID.name.should.be.exactly('testCricketPlayerType');
					done();
				});
		});
	});
});

describe('Sending a PUT to /api/v1/cricketPlayers/:objectId', function(){
	describe('should fail', function(){
		it('when the current user is not an admin.', function(done){
			requestLocal
				.put('/api/v1/cricketPlayers/' + testCricketPlayer.objectId)
				.send({
					sessionToken: testUser.sessionToken
				})
				.expect(403)
				.end(done);
		});
		it('when the name is not alphanumeric.', function(done){
			requestLocal
				.put('/api/v1/cricketPlayers/' + testCricketPlayer.objectId)
				.send({
					sessionToken: testAdmin.sessionToken,
					name: 'aiestnrh87$$%',
					// name: 'updatedTestCricketPlayer',
					team: 'updatedTestCricketPlayerTeam',
					cost: 8,
					cricketPlayerTypeId: testCricketPlayerType.objectId
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.name[0].should.be.exactly('The name field must be alphanumeric.');
					done();
				});
		});
		it('when the team is not alphanumeric.', function(done){
			requestLocal
				.put('/api/v1/cricketPlayers/' + testCricketPlayer.objectId)
				.send({
					sessionToken: testAdmin.sessionToken,
					name: 'updatedTestCricketPlayer',
					team: 'wuyflpgj%$^#',
					// team: 'updatedTestCricketPlayerTeam',
					cost: 8,
					cricketPlayerTypeId: testCricketPlayerType.objectId
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.team[0].should.be.exactly('The team field must be alphanumeric.');
					done();
				});
		});
		it('when the cricketPlayerTypeId is not alphanumeric.', function(done){
			requestLocal
				.put('/api/v1/cricketPlayers/' + testCricketPlayer.objectId)
				.send({
					sessionToken: testAdmin.sessionToken,
					name: 'updatedTestCricketPlayer',
					team: 'updatedTestCricketPlayerTeam',
					cost: 8,
					cricketPlayerTypeId: 'wuyflpgj%$^#',
					// cricketPlayerTypeId: testCricketPlayerType.objectId
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.cricketPlayerTypeId[0].should.be.exactly('The cricketPlayerTypeId field must be alphanumeric.');
					done();
				});
		});
		it('when the cost is not a number.', function(done){
			requestLocal
				.put('/api/v1/cricketPlayers/' + testCricketPlayer.objectId)
				.send({
					sessionToken: testAdmin.sessionToken,
					name: 'updatedTestCricketPlayer',
					team: 'updatedTestCricketPlayerTeam',
					// cost: 8,
					cost: 'wuyflpgj%$^#',
					cricketPlayerTypeId: testCricketPlayerType.objectId
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.cost[0].should.be.exactly('The cost must be a number.');
					done();
				});
		});
	});
	describe('should succeed', function(){
		it('when updating the testCricketPlayer.', function(done){
			requestLocal
				.put('/api/v1/cricketPlayers/' + testCricketPlayer.objectId)
				.send({
					sessionToken: testAdmin.sessionToken,
					name: 'updatedTestCricketPlayer',
					team: 'updatedTestCricketPlayerTeam',
					cost: 8,
					cricketPlayerTypeId: testCricketPlayerType.objectId
				})
				.expect(200)
				.end(done);
		});
	});
});

describe('Sending a DELETE to /api/v1/cricketPlayers/:objectId', function(){
	describe('should fail', function(){
		it('when a testUser tries to delete a testCricketPlayer.', function(done){
			requestLocal
				.del('/api/v1/cricketPlayers/' + testCricketPlayer.objectId)
				.send({
					sessionToken: testUser.sessionToken
				})
				.expect(403)
				.end(done);
		});
	});
	describe('should succeed', function(){
		it('when an admin deletes a cricket player.', function(done){
			requestLocal
				.del('/api/v1/cricketPlayers/' + testCricketPlayer.objectId)
				.send({
					sessionToken: testAdmin.sessionToken
				})
				.expect(200)
				.end(done);
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
	it('the testUser.', function(done){
		requestLocal
			.del('/api/v1/users/' + testUser.objectId)
			.send({
				sessionToken: testUser.sessionToken
			})
			.expect(200)
			.end(done);
	});
	it('the testAdmin.', function(done){
		requestLocal
			.del('/api/v1/users/' + testAdmin.objectId)
			.send({
				sessionToken: testAdmin.sessionToken
			})
			.expect(200)
			.end(done);
	});
});