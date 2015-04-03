var should = require('should');
var supertest = require('supertest');

var requestLocal = supertest('http://localhost:3000');

describe('Sending a GET to /api/v1/matches', function(){
	describe('should succeed', function(){
		it('in getting all the matches.', function(done){
			requestLocal
				.get('/api/v1/matches')
				.expect(200)
				.end(function(err, res){
					if(err) return done(err);

					res.body.matches[0].objectId.should.be.type('string');
					done();
				});
		});
	});
});