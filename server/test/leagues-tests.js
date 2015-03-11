var supertest = require('supertest');
var should = require('should');

var requestLocal = supertest('http://localhost:3000');
var requestParse = supertest('https://api.parse.com');
var leagueWithNoRoom;
var leagueWithRoom;
var testUser;

describe('Preparing for the tests', function(){
	describe('by creating a league', function(){
		it('that has no room for new users', function(done){
			requestParse
				.post('/1/classes/League')
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.set('Content-Type', 'application/json')
				.send({
					entryFee: 10,
					guaranteedPrize: 3,
					maxEntries: 5,
					multiEntry: false,
					name: 'Test League',
					noOfEntries: 5,
					winningPrize: 10
				})
				.end(function(err, res){
					if(err) return done(err);

					leagueWithNoRoom = res.body;
					done();
				});
		});

		it('that has room for new users', function(done){
			requestParse
				.post('/1/classes/League')
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.set('Content-Type', 'application/json')
				.send({
					entryFee: 10,
					guaranteedPrize: 3,
					maxEntries: 5,
					multiEntry: false,
					name: 'Test League with room',
					noOfEntries: 10,
					winningPrize: 10
				})
				.end(function(err, res){
					if(err) return done(err);

					leagueWithRoom = res.body;
					done();
				});
		});
	});

	describe('by creating a user', function(){
		it('to add to the test league', function(done){
			requestParse
				.post('/1/users')
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.set('Content-Type', 'application/json')
				.send({
					username: 'testUser',
					password: 'password',
					email: 'testUser@latitude40.com'
				})
				.end(function(err, res){
					if(err) return done(err);

					testUser = res.body;
					done();
				});
		});
	});
});

describe('Sending a POST to /api/v1/leagues/<objectId>', function(){
	describe('with the url parameter "addUser" set to true', function(){
		it('should fail to add the user to the league when the league is full', function(done){
			requestLocal
				.post('/api/v1/leagues/' + leagueWithNoRoom.objectId + '?addUser=true')
				.send({
					user: testUser
				})
				.expect(518)
				.end(done);
		});

		it('should succeed', function(done){
			requestLocal
				.post('/api/v1/leagues/' + leagueWithRoom.objectId + '?addUser=true')
				.send({
					user: testUser
				})
				.expect(200)
				.end(done);
		});

		it('should fail if the user tries to get added to the league again', function(done){
			requestLocal
				.post('/api/v1/leagues/' + leagueWithRoom.objectId + '?addUser=true')
				.send({
					user: testUser
				})
				.expect(519)
				.end(done);
		});
	});
});

describe('Cleaning up after the leagues tests', function(){
	describe('by removing the test league', function(){
		it('without room for new users', function(done){
			requestParse
				.del('/1/classes/League/' + leagueWithNoRoom.objectId)
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.end(done);
		});
	});

	describe('by removing the user', function(){
		it('testUser', function(done){
			requestParse
				.del('/1/users/' + testUser.objectId)
				.set('X-Parse-Application-Id', 'GeuNrmGKg5XYigjeBfB9w9mQWqp4WFWHDYqQPIzD')
				.set('X-Parse-REST-API-Key', 'P5eKUwI4NOVquvQTPye7fMaAK2dcLNRkBVV8Xfdl')
				.set('X-Parse-Session-Token', testUser.sessionToken)
				.end(done);
		});
	});
});