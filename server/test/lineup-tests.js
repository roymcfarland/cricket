var supertest = require('supertest');
var should = require('should');

var requireLocal = supertest('http://localhost:3000');
var requireParse = supertest('https://api.parse.com');
var testUserLeague;
var testUser;
var testLeague;
var testMatch;
var testLineup;

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
					owner: testUser.objectId,
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
		it('when the UserLeagueId is not sent in', function(done){
			requireLocal
				.post('/api/v1/lineups')
				.send({
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

		it('when the UserLeagueId is not an alpha numeric string', function(done){
			requireLocal
				.post('/api/v1/lineups')
				.send({
					UserLeagueId: '=',
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

		it('when the MatchID is not sent in', function(done){
			requireLocal
				.post('/api/v1/lineups')
				.send({
					UserLeagueId: testUserLeague.objectId,
					Locked: false,
					user: testUser
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.MatchID[0].should.be.exactly('The MatchID field is required.');
					done();
				});
		});

		it('when the MatchID is not an alpha numeric string', function(done){
			requireLocal
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

		it('when the Locked is not sent in', function(done){
			requireLocal
				.post('/api/v1/lineups')
				.send({
					UserLeagueId: testUserLeague.objectId,
					MatchID: testMatch.objectId,
					// Locked: false,
					user: testUser
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.Locked[0].should.be.exactly('The Locked field is required.');
					done();
				});
		});

		it('when the Locked is not a boolean', function(done){
			requireLocal
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

		it('when the user is not sent in', function(done){
			requireLocal
				.post('/api/v1/lineups')
				.send({
					UserLeagueId: testUserLeague.objectId,
					MatchID: testMatch.objectId,
					Locked: false,
					// user: testUser
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.user[0].should.be.exactly('The user objectId must be included.');
					done();
				});
		});

		it('when the user objectId is not alphanumeric', function(done){
			requireLocal
				.post('/api/v1/lineups')
				.send({
					UserLeagueId: testUserLeague.objectId,
					MatchID: testMatch.objectId,
					Locked: false,
					// user: testUser
					user: {objectId: '==', sessionToken: testUser.sessionToken}
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.user[0].should.be.exactly('The user objectId must be included.');
					done();
				});
		});

		it('when the user sessionToken is not alphanumeric', function(done){
			requireLocal
				.post('/api/v1/lineups')
				.send({
					UserLeagueId: testUserLeague.objectId,
					MatchID: testMatch.objectId,
					Locked: false,
					// user: testUser
					user: {objectId: testUser.objectId, sessionToken: 'testUser.sessionToken'}
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.user[0].should.be.exactly('The user sessionToken must be included.');
					done();
				});
		});

		it('when the user is not logged in to parse', function(done){
			requireLocal
				.post('/api/v1/lineups')
				.send({
					UserLeagueId: testUserLeague.objectId,
					MatchID: testMatch.objectId,
					Locked: false,
					// user: testUser
					user: {objectId: testUser.objectId, sessionToken: 'notarealsessiontoken'}
				})
				.expect(520)
				.end(function(err, res){
					if(err) return done(err);

					res.body.error.code.should.be.exactly(101);
					res.body.error.error.should.be.exactly('invalid session');
					done();
				});
		});
	});

	describe('should succeed', function(){
		it('when all the right stuff is passed in.', function(done){
			requireLocal
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
					testLineup = res.body;
					done();
				});
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
	});
});