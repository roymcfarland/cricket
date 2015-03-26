var supertest = require('supertest');
var should = require('should');

var requestLocal = supertest('http://localhost:3000');
var requestParse = supertest('https://api.parse.com');

describe('Sending a GET to /api/v1/userLeagues', function(){
	describe('should fail', function(){
		it('when the leagueId is not alphanumeric.', function(done){
			requestLocal
				.get('/api/v1/userLeagues?leagueId=LUJG!!!')
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.leagueId[0].should.be.exactly('The leagueId field must be alphanumeric.');
					done();
				});
		});
		it('when the userId is not alphanumeric.', function(done){
			requestLocal
				.get('/api/v1/userLeagues?userId=LUJG!!!')
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.userId[0].should.be.exactly('The userId field must be alphanumeric.');
					done();
				});
		});
	});
});