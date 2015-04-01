var supertest = require('supertest');
var should = require('should');
var config = require('../config/config');

var requestLocal = supertest('http://localhost:3000');
var requestParse = supertest('https://api.parse.com');
var testUser;
var testAdmin;
var testLeague;

describe('Preparing for the GET userLeagues tests', function(){
	describe('by creating', function(){
		it('a testUser.', function(done){
			requestParse
				.post('/1/users')
				.set('Content-Type', 'application/json')
				.set('X-Parse-Application-Id', config.parse.applicationId)
				.set('X-Parse-Master-Key', config.parse.masterKey)
				.send({
					"username": "testUser",
					"password": "password",
					"email": "testUser@latitude40.com",
					totalScore: 0,
					Money: 0,
					admin: false
				})
				.expect(201)
				.end(function(err, res) {
					if(err) return done(err);
					if(res.body.code) return done(res.body);

					res.body.createdAt.should.have.type('string');
					res.body.objectId.should.have.type('string');
					res.body.sessionToken.should.have.type('string');
					testUser = res.body;
					done();
				});
		});
		it('a testAdmin.', function(done){
			requestParse
				.post('/1/users')
				.set('Content-Type', 'application/json')
				.set('X-Parse-Application-Id', config.parse.applicationId)
				.set('X-Parse-Master-Key', config.parse.masterKey)
				.send({
					"username": "testAdmin",
					"password": "password",
					"email": "testAdmin@latitude40.com",
					totalScore: 0,
					Money: 0,
					admin: true
				})
				.expect(201)
				.end(function(err, res) {
					if(err) return done(err);
					if(res.body.code) return done(res.body);

					res.body.createdAt.should.have.type('string');
					res.body.objectId.should.have.type('string');
					res.body.sessionToken.should.have.type('string');
					testAdmin = res.body;
					done();
				});
		});
		it('a testLeague.', function(done){
			requestParse
				.post('/1/classes/League')
				.set('X-Parse-Application-Id', config.parse.applicationId)
				.set('X-Parse-Master-Key', config.parse.masterKey)
				.send({
					entryFee: 10,
					guaranteedPrize: 0,
					maxEntries: 50,
					multiEntries: false,
					name: 'testLeague',
					noOfEntries: 0,
					owner: {
						__type: 'Pointer',
						className: '_User',
						objectId: testUser.objectId
					},
					totalScore: 0,
					winningPrize: 10000
				})
				.end(function(err, res){
					if(err) return done(err);
					console.log(res.body);
					if(res.body.code) return done(res.body);

					testLeague = res.body;
					done();
				});
		});
	});
});

describe('Sending a GET to /api/v1/userLeagues', function(){
	describe('should fail', function(){
		it('when the leagueId is not alphanumeric.', function(done){
			requestLocal
				.get('/api/v1/userLeagues?leagueId=LUJG!!!&sessionToken=' + testUser.sessionToken)
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.leagueId[0].should.be.exactly('The leagueId field must be alphanumeric.');
					done();
				});
		});
		it('when the userId is not alphanumeric.', function(done){
			requestLocal
				.get('/api/v1/userLeagues?userId=LUJG!!!&sessionToken=' + testUser.sessionToken)
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.userId[0].should.be.exactly('The userId field must be alphanumeric.');
					done();
				});
		});
		it('when getting all userLeagues when the user is not an admin.', function(done){
			requestLocal
				.get('/api/v1/userLeagues?sessionToken=' + testUser.sessionToken)
				.expect(403)
				.end(done);
		});
	});
	describe('should succeed', function(){
		it('when getting all user leagues as an admin.', function(done){
			requestLocal
				.get('/api/v1/userLeagues?sessionToken=' + testAdmin.sessionToken)
				.expect(200)
				.end(function(err, res){
					if(err) return done(err);
					if(res.body.code) return done(res.body);

					res.body[0].objectId.should.be.type('string');
					res.body[0].LeagueID.name.should.be.type('string');
					res.body[0].UserID.username.should.be.type('string');
					done();
				});
		});
		it('when getting certain user leagues.', function(done){
			requestLocal
				.get('/api/v1/userLeagues?sessionToken=' + testUser.sessionToken + '&leagueId=aIQmutRHfO')
				.expect(200)
				.end(function(err, res){
					if(err) return done(err);
					if(res.body.code) return done(res.body);

					res.body[0].objectId.should.be.type('string');
					res.body[0].LeagueID.name.should.be.type('string');
					res.body[0].UserID.username.should.be.type('string');
					done();
				});
		});
		it('when getting certain user leagues.', function(done){
			requestLocal
				.get('/api/v1/userLeagues?sessionToken=' + testUser.sessionToken + '&userId=TZuZi1EJ1K')
				.expect(200)
				.end(function(err, res){
					if(err) return done(err);
					if(res.body.code) return done(res.body);

					res.body[0].objectId.should.be.type('string');
					res.body[0].LeagueID.name.should.be.type('string');
					res.body[0].UserID.username.should.be.type('string');
					done();
				});
		});
		it('when getting certain user leagues.', function(done){
			requestLocal
				.get('/api/v1/userLeagues?sessionToken=' + testUser.sessionToken + '&userId=TZuZi1EJ1K' + '&leagueId=aIQmutRHfO')
				.expect(200)
				.end(function(err, res){
					if(err) return done(err);
					if(res.body.code) return done(res.body);

					res.body[0].objectId.should.be.type('string');
					res.body[0].LeagueID.name.should.be.type('string');
					res.body[0].UserID.username.should.be.type('string');
					done();
				});
		});
	});
});

describe('Cleaning up after the user league tests', function(){
	describe('by removing', function(){
		it('testUser from Parse.', function(done){
			requestParse
				.del('/1/users/' + testUser.objectId)
				.set('X-Parse-Application-Id', config.parse.applicationId)
				.set('X-Parse-Master-Key', config.parse.masterKey)
				.end(done);
		});
		it('testAdmin from Parse.', function(done){
			requestParse
				.del('/1/users/' + testAdmin.objectId)
				.set('X-Parse-Application-Id', config.parse.applicationId)
				.set('X-Parse-Master-Key', config.parse.masterKey)
				.end(done);
		});
	});
});