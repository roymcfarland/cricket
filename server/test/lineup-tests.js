var supertest = require('supertest');
var should = require('should');
var _ = require('underscore');
var config = require('../config/config');

var requestLocal = supertest('http://localhost:3000');
var requestParse = supertest('https://api.parse.com');
var testUserLeague;
var testUser;
var testUser2;
var testLeague;
var testMatch;
var testLineup;
var testLineup2;
var testLineup3;
var testLineupWithCaptain;
var testCricketPlayer;
var testAdmin;
var testCricketPlayerType;

describe('Preparing for the tests', function(){
	describe('by creating a', function(){
		it('testUser', function(done){
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

					testUser = res.body;
					done();
				});
		});
		it('testUser2.', function(done){
			requestLocal
				.post('/api/v1/users')
				.send({
					username: 'testuser2',
					password: 'password',
					email: 'testuser2@latitude40.com'
				})
				.expect(201)
				.end(function(err, res){
					if(err) return done(err);

					res.body.objectId.should.be.type('string');
					testUser2 = res.body;
					done();
				});
		});
		it('testLeague', function(done){
			requestParse
				.post('/1/classes/League')
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.send({
					entryFee: 10,
					guaranteedPrize: 10,
					maxEntries: 1,
					multiEntry: false,
					name: 'Test League',
					noOfEntries: 0,
					owner: {
						__type: 'Pointer',
						className: '_User',
						objectId: testUser.objectId
					},
					totalScore: 0,
					winningPrize: 10
				})
				.end(function(err, res){
					if(err) return done(err);

					testLeague = res.body;
					done();
				});
		});

		it('testUserLeague', function(done){
			requestParse
				.post('/1/classes/UserLeague')
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.send({
					LeagueID: {
						__type: 'Pointer',
						className: 'League',
						objectId: testLeague.objectId
					},
					UserID: {
						"__type":"Pointer",
						"className":"_User",
						"objectId":testUser.objectId
					},
					BeginningBalance: 100000
				})
				.end(function(err, res){
					if(err) return done(err);

					testUserLeague = res.body;
					done();
				});
		});

		it('testMatch', function(done){
			requestParse
				.post('/1/classes/Match')
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.send({
					Name: 'Test Match',
					StartDateTime: {
						__type: 'Date',
						iso: new Date()
					}
				})
				.end(function(err, res){
					if(err) return done(err);

					testMatch = res.body;
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
		it('testCricketPlayer.', function(done){
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

describe('Sending a POST to /api/v1/lineups', function(){
	describe('should fail', function(){
		it('when the MatchID is not an alpha numeric string', function(done){
			requestLocal
				.post('/api/v1/lineups')
				.send({
					UserLeagueId: testUserLeague.objectId,
					MatchID: '=',
					Locked: false,
					user: testUser
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.MatchID[0].should.be.exactly('The MatchID field must be alphanumeric.');
					done();
				});
		});
		it('when the UserLeagueId is not an alpha numeric string', function(done){
			requestLocal
				.post('/api/v1/lineups')
				.send({
					UserLeagueId: 'testUserLeague.objectId',
					MatchID: testMatch.objectId,
					Locked: false,
					user: testUser
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.UserLeagueId[0].should.be.exactly('The UserLeagueId field must be alphanumeric.');
					done();
				});
		});
		it('when the UserLeagueId is not included.', function(done){
			requestLocal
				.post('/api/v1/lineups')
				.send({
					// UserLeagueId: 'testUserLeague.objectId',
					MatchID: testMatch.objectId,
					Locked: false,
					user: testUser
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.UserLeagueId[0].should.be.exactly('The UserLeagueId field is required.');
					done();
				});
		});
		it('when the Locked is not a boolean', function(done){
			requestLocal
				.post('/api/v1/lineups')
				.send({
					UserLeagueId: testUserLeague.objectId,
					MatchID: testMatch.objectId,
					Locked: 1234,
					user: testUser
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.Locked[0].should.be.exactly('The Locked field must be a boolean.');
					done();
				});
		});
		it('when the captain is not an alpha numeric string', function(done){
			requestLocal
				.post('/api/v1/lineups')
				.send({
					UserLeagueId: testUserLeague.objectId,
					MatchID: testMatch.objectId,
					Locked: false,
					user: testUser,
					captain: 'aois%^$#ner'
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.captain[0].should.be.exactly('The captain field must be alphanumeric.');
					done();
				});
		});
	});

	describe('should succeed', function(){
		it('when the MatchID is not passed in.', function(done){
			requestLocal
				.post('/api/v1/lineups')
				.send({
					UserLeagueId: testUserLeague.objectId,
					// MatchID: testMatch.objectId,
					Locked: false,
					user: testUser
				})
				.expect(201)
				.end(function(err, res){
					if(err) return done(err);

					res.body.objectId.should.be.type('string');
					testLineup = res.body;
					done();
				});
		});
		it('when the MatchID is passed in.', function(done){
			requestLocal
				.post('/api/v1/lineups')
				.send({
					UserLeagueId: testUserLeague.objectId,
					MatchID: testMatch.objectId,
					Locked: false,
					user: testUser
				})
				.expect(201)
				.end(function(err, res){
					if(err) return done(err);

					res.body.objectId.should.be.type('string');
					testLineup2 = res.body;
					done();
				});
		});
		it('when creating testLineup3.', function(done){
			requestLocal
				.post('/api/v1/lineups')
				.send({
					UserLeagueId: testUserLeague.objectId,
					MatchID: testMatch.objectId,
					Locked: false,
					user: testUser2
				})
				.expect(201)
				.end(function(err, res){
					if(err) return done(err);

					res.body.objectId.should.be.type('string');
					testLineup3 = res.body;
					done();
				});
		});
		it('when creating testLineupWithCaptain.', function(done){
			requestLocal
				.post('/api/v1/lineups')
				.send({
					UserLeagueId: testUserLeague.objectId,
					MatchID: testMatch.objectId,
					Locked: false,
					user: testUser2,
					captain: testCricketPlayer.objectId
				})
				.expect(201)
				.end(function(err, res){
					if(err) return done(err);

					res.body.objectId.should.be.type('string');
					testLineupWithCaptain = res.body;
					done();
				});
		});
	});
});

describe('Sending a GET to /api/v1/lineups', function(){
	describe('should succeed', function(){
		it('in getting all of the lineups.', function(done){
			requestLocal
			.get('/api/v1/lineups')
			.query('sessionToken=' + testUser.sessionToken)
			.end(function(err, res){
				if(err) return done(err);
				if(res.body.code) return done(res.body);


				res.body[0].objectId.should.be.type('string');
				var lineup = _.findWhere(res.body, {objectId: testLineupWithCaptain.objectId});
				lineup.captain.name.should.be.exactly('testCricketPlayer');
				done();
			});
		});
	});
});

describe('Sending a GET to /api/v1/lineups/:objectId', function(){
	describe('should succeed', function(){
		it('in getting the testLineup.', function(done){
			requestLocal
			.get('/api/v1/lineups/' + testLineupWithCaptain.objectId)
			.query('sessionToken=' + testUser.sessionToken)
			.end(function(err, res){
				if(err) return done(err);
				if(res.body.code) return done(res.body);

				res.body.objectId.should.be.exactly(testLineupWithCaptain.objectId);
				res.body.Locked.should.be.exactly(false);
				res.body.UserLeagueID.UserID.username.should.be.exactly('testUser');
				res.body.captain.name.should.be.exactly('testCricketPlayer');
				done();
			});
		});
	});
});

describe('Sending a PUT to /api/v1/lineups/:objectId', function(){
	describe('should fail', function(){
		it('when the user is not the same as the one connected to the lineup.', function(done){
			requestLocal
			.put('/api/v1/lineups/' + testLineup.objectId)
			.send({
				sessionToken: testUser2.sessionToken,
				Locked: true,
				MatchID: testMatch.objectId
			})
			.expect(403)
			.end(done);
		});
		it('when Locked is not a boolean.', function(done){
			requestLocal
			.put('/api/v1/lineups/' + testLineup.objectId)
			.send({
				sessionToken: testUser.sessionToken,
				Locked: 'taresnth',
				MatchID: testMatch.objectId
			})
			.expect(428)
			.end(function(err, res){
				if(err) return done(err);

				res.body.errors.Locked[0].should.be.exactly('The Locked field must be a boolean.');
				done();
			});
		});
		it('when MatchID is not alphanumeric.', function(done){
			requestLocal
			.put('/api/v1/lineups/' + testLineup.objectId)
			.send({
				sessionToken: testUser.sessionToken,
				Locked: true,
				MatchID: 'testMatch.objectId'
			})
			.expect(428)
			.end(function(err, res){
				if(err) return done(err);

				res.body.errors.MatchID[0].should.be.exactly('The MatchID field must be alphanumeric.');
				done();
			});
		});
		it('when captain is not alphanumeric.', function(done){
			requestLocal
			.put('/api/v1/lineups/' + testLineup.objectId)
			.send({
				sessionToken: testUser.sessionToken,
				Locked: true,
				MatchID: testMatch.objectId,
				captain: 'testCricketPlayer.objectId'
			})
			.expect(428)
			.end(function(err, res){
				if(err) return done(err);

				res.body.errors.captain[0].should.be.exactly('The captain field must be alphanumeric.');
				done();
			});
		});
	});
	describe('should succeed', function(){
		after('Verifying that the lineup was updated on Parse.', function(done){
			requestLocal
			.get('/api/v1/lineups/' + testLineup.objectId)
			.query('sessionToken=' + testUser.sessionToken)
			.end(function(err, res){
				if(err) return done(err);
				if(res.body.code) return done(res.body);

				res.body.objectId.should.be.exactly(testLineup.objectId);
				res.body.Locked.should.be.exactly(true);
				res.body.UserLeagueID.UserID.username.should.be.exactly('testUser');
				res.body.captain.name.should.be.exactly('testCricketPlayer');
				done();
			});
		});
		it('when the user updates their own lineup.', function(done){
			requestLocal
			.put('/api/v1/lineups/' + testLineup.objectId)
			.send({
				sessionToken: testUser.sessionToken,
				Locked: true,
				MatchID: testMatch.objectId,
				captain: testCricketPlayer.objectId
			})
			.expect(200)
			.end(function(err, res){
				if(err) return done(err);
				if(res.body.code) return done(res.body);

				done();
			});
		});
	});
});

describe('Sending a DELETE to /api/v1/lineups/:objectId', function(){
	describe('should fail', function(){
		it('when the current user is not the owner of the lineup.', function(done){
			requestLocal
			.del('/api/v1/lineups/' + testLineup.objectId)
			.send({
				sessionToken: testUser2.sessionToken
			})
			.expect(403)
			.end(done);
		});
	});
	describe('should succeed', function(){
		it('in deleting the testLineup3.', function(done){
			requestLocal
			.del('/api/v1/lineups/' + testLineup.objectId)
			.send({
				sessionToken: testUser.sessionToken
			})
			.expect(200)
			.end(done);
		});
	});
});

describe('Cleaning up after the tests', function(){
	describe('by deleting the user', function(){
		it('testUser', function(done){
			requestParse
				.del('/1/users/' + testUser.objectId)
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.set('X-Parse-Session-Token', testUser.sessionToken)
				.end(done);
		});
		it('testUser2.', function(done){
			requestLocal
				.del('/api/v1/users/' + testUser2.objectId)
				.send({
					sessionToken: testUser2.sessionToken
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
	describe('by deleting the league', function(){
		it('testLeague', function(done){
			requestParse
				.del('/1/classes/League/' + testLeague.objectId)
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.end(done);
		});
	});

	describe('by deleting the user league', function(){
		it('testUserLeague', function(done){
			requestParse
				.del('/1/classes/UserLeague/' + testUserLeague.objectId)
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.end(done);
		});
	});

	describe('by deleting the match', function(){
		it('testMatch', function(done){
			requestParse
				.del('/1/classes/Match/' + testMatch.objectId)
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.end(done);
		});
	});

	describe('by deleting the Lineup', function(){
		it('testLineup', function(done){
			requestParse
				.del('/1/classes/Lineup/' + testLineup.objectId)
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.end(done);
		});
		it('testLineup2', function(done){
			requestParse
				.del('/1/classes/Lineup/' + testLineup2.objectId)
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.end(done);
		});
		it('testLineup3', function(done){
			requestParse
				.del('/1/classes/Lineup/' + testLineup3.objectId)
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.end(done);
		});
	});
	describe('by deleting the cricket player', function(){
		it('testCricketPlayer.', function(done){
			requestParse
				.del('/1/classes/CricketPlayer/' + testCricketPlayer.objectId)
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.end(done);
		});
	});
	describe('by deleting the cricket player', function(){
		it('testCricketPlayer.', function(done){
			requestParse
				.del('/1/classes/CricketPlayer/' + testCricketPlayer.objectId)
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.end(done);
		});
	});
	describe('by deleting the cricket player type', function(){
		it('testCricketPlayerType.', function(done){
			requestParse
				.del('/1/classes/CricketPlayerType/' + testCricketPlayerType.objectId)
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.end(done);
		});
	});
});