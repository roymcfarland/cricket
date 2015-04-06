var supertest = require('supertest');
var should = require('should');
var _ = require('underscore');

var requestLocal = supertest('http://localhost:3000');
var requireParse = supertest('https://api.parse.com');
var testUserLeague;
var testUser;
var testUser2;
var testLeague;
var testMatch;
var testLineup;
var testLineup2;
var testLineup3;

describe('Preparing for the tests', function(){
	describe('by creating a', function(){
		it('testUser', function(done){
			requireParse
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
			requireParse
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
			requireParse
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
			requireParse
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
					testLineup2 = res.body;
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

				var lineup = _.findWhere(res.body, {objectId: testLineup.objectId});

				lineup.Locked.should.be.exactly(false);
				lineup.UserLeagueID.UserID.username.should.be.exactly('testUser');
				done();
			});
		});
	});
});

describe('Sending a GET to /api/v1/lineups/:objectId', function(){
	describe('should succeed', function(){
		it('in getting the testLineup.', function(done){
			requestLocal
			.get('/api/v1/lineups/' + testLineup.objectId)
			.query('sessionToken=' + testUser.sessionToken)
			.end(function(err, res){
				if(err) return done(err);
				if(res.body.code) return done(res.body);

				res.body.objectId.should.be.exactly(testLineup.objectId);
				res.body.Locked.should.be.exactly(false);
				res.body.UserLeagueID.UserID.username.should.be.exactly('testUser');
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
	});
});

describe('Cleaning up after the tests', function(){
	describe('by deleting the user', function(){
		it('testUser', function(done){
			requireParse
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
	});
	describe('by deleting the league', function(){
		it('testLeague', function(done){
			requireParse
				.del('/1/classes/League/' + testLeague.objectId)
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.end(done);
		});
	});

	describe('by deleting the user league', function(){
		it('testUserLeague', function(done){
			requireParse
				.del('/1/classes/UserLeague/' + testUserLeague.objectId)
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.end(done);
		});
	});

	describe('by deleting the match', function(){
		it('testMatch', function(done){
			requireParse
				.del('/1/classes/Match/' + testMatch.objectId)
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.end(done);
		});
	});

	describe('by deleting the Lineup', function(){
		it('testLineup', function(done){
			requireParse
				.del('/1/classes/Lineup/' + testLineup.objectId)
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.end(done);
		});
		it('testLineup2', function(done){
			requireParse
				.del('/1/classes/Lineup/' + testLineup2.objectId)
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.end(done);
		});
	});
});