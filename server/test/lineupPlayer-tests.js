var supertest = require('supertest');
var should = require('should');

var requireLocal = supertest('http://localhost:3000');
var requireParse = supertest('https://api.parse.com');
var testUserLeague;
var testUser;
var testLeague;
var testMatch;
var testLineup;
var testCricketPlayer;
var testLineupPlayer;

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

		it('testLineup', function(done){
			requireParse
				.post('/1/classes/Lineup')
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.send({
					UserLeagueID: {
						__type: 'Pointer',
						className: 'UserLeague',
						objectId: testUserLeague.objectId
					},
					MatchID: {
						__type: 'Pointer',
						className: 'Match',
						objectId: testMatch.objectId
					},
					Locked: false
				})
				.end(function(err, res){
					if(err) return done(err);

					testLineup = res.body;
					done();
				});
		});

		it('testCricketPlayer', function(done){
			requireParse
				.post('/1/classes/CricketPlayer')
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.send({
					name: 'Test Cricket Player',
					team: 'Test Cricket Team',
					cost: 100000,
					CricketPlayerTypeID: {
						__type: 'Pointer',
						className: 'CricketPlayerType',
						objectId: 'MKmUGrdjBM'
					}
				})
				.end(function(err, res){
					if(err) return done(err);

					testCricketPlayer = res.body;
					done();
				});
		});
	});
});

describe('Sending a POST to /api/v1/lineupPlayers', function(){
	describe('should fail', function(){
		it('when the users objectId is not sent in.', function(done){
			requireLocal
				.post('/api/v1/lineupPlayers')
				.send({
					// user: testUser,
					user: {
						sessionToken: testUser.sessionToken
					},
					LineupID: testLineup.objectId,
					CricketPlayerID: testCricketPlayer.objectId
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);
					if(res.body.code) return done(res.body.code);

					res.body.errors.user[0].should.be.exactly('The user objectId must be included.');
					done();
				});
		});

		it('when the users objectId is not alphanumeric.', function(done){
			requireLocal
				.post('/api/v1/lineupPlayers')
				.send({
					// user: testUser,
					user: {
						objectId: '=',
						sessionToken: testUser.sessionToken
					},
					LineupID: testLineup.objectId,
					CricketPlayerID: testCricketPlayer.objectId
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);
					if(res.body.code) return done(res.body.code);

					res.body.errors.user[0].should.be.exactly('The user objectId must be included.');
					done();
				});
		});

		it('when the users sessionToken is not sent in.', function(done){
			requireLocal
				.post('/api/v1/lineupPlayers')
				.send({
					// user: testUser,
					user: {
						objectId: testUser.objectId
					},
					LineupID: testLineup.objectId,
					CricketPlayerID: testCricketPlayer.objectId
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);
					if(res.body.code) return done(res.body.code);

					res.body.errors.user[0].should.be.exactly('The user sessionToken must be included.');
					done();
				});
		});

		it('when the users sessionToken is not alphanumeric.', function(done){
			requireLocal
				.post('/api/v1/lineupPlayers')
				.send({
					// user: testUser,
					user: {
						objectId: testUser.objectId,
						sessionToken: '='
					},
					LineupID: testLineup.objectId,
					CricketPlayerID: testCricketPlayer.objectId
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);
					if(res.body.code) return done(res.body.code);

					res.body.errors.user[0].should.be.exactly('The user sessionToken must be included.');
					done();
				});
		});

		it('when the LineupID is not included.', function(done){
			requireLocal
				.post('/api/v1/lineupPlayers')
				.send({
					user: testUser,
					// LineupID: testLineup.objectId,
					CricketPlayerID: testCricketPlayer.objectId
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);
					if(res.body.code) return done(res.body.code);

					res.body.errors.LineupID[0].should.be.exactly('The LineupID field is required.');
					done();
				});
		});

		it('when the LineupID is not alphanumeric.', function(done){
			requireLocal
				.post('/api/v1/lineupPlayers')
				.send({
					user: testUser,
					LineupID: '=',
					// LineupID: testLineup.objectId,
					CricketPlayerID: testCricketPlayer.objectId
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);
					if(res.body.code) return done(res.body.code);

					res.body.errors.LineupID[0].should.be.exactly('The LineupID field must be alphanumeric.');
					done();
				});
		});

		it('when the CricketPlayerID is not included.', function(done){
			requireLocal
				.post('/api/v1/lineupPlayers')
				.send({
					user: testUser,
					LineupID: testLineup.objectId,
					// CricketPlayerID: testCricketPlayer.objectId
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);
					if(res.body.code) return done(res.body.code);

					res.body.errors.CricketPlayerID[0].should.be.exactly('The CricketPlayerID field is required.');
					done();
				});
		});

		it('when the CricketPlayerID is not alphanumeric.', function(done){
			requireLocal
				.post('/api/v1/lineupPlayers')
				.send({
					user: testUser,
					LineupID: testLineup.objectId,
					CricketPlayerID: '='
					// CricketPlayerID: testCricketPlayer.objectId
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);
					if(res.body.code) return done(res.body.code);

					res.body.errors.CricketPlayerID[0].should.be.exactly('The CricketPlayerID field must be alphanumeric.');
					done();
				});
		});

		it('when the user sessionToken is not accepted by parse.', function(done){
			requireLocal
				.post('/api/v1/lineupPlayers')
				.send({
					user: {
						objectId: testUser.objectId,
						sessionToken: 'ytdlj890r7'
					},
					// user: testUser,
					LineupID: testLineup.objectId,
					CricketPlayerID: testCricketPlayer.objectId
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
		it('when creating a new LineupPlayer', function(done){
			requireLocal
				.post('/api/v1/lineupPlayers')
				.send({
					user: testUser,
					LineupID: testLineup.objectId,
					CricketPlayerID: testCricketPlayer.objectId
				})
				.expect(201)
				.end(function(err, res){
					if(err) return done(err);
					if(res.body.code) return done(res.body.code);

					res.body.objectId.should.be.type('string');
					testLineupPlayer = res.body;
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

	describe('by deleting the Cricket Player', function(){
		it('testCricketPlayer', function(done){
			requireParse
				.del('/1/classes/CricketPlayer/' + testCricketPlayer.objectId)
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.end(done);
		});
	});

	describe('by deleting the Lineup Player', function(){
		it('testLineupPlayer', function(done){
			requireParse
				.del('/1/classes/LineupPlayer/' + testLineupPlayer.objectId)
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.end(done);
		});
	});
});