var supertest = require('supertest');

var requestLocal = supertest('http://localhost:3000');
var testUser;

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
});