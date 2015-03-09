var supertest = require('supertest');
var should = require('should');

var request = supertest('http://localhost:3000');

describe('Sending a GET', function(){
	describe('to /api/v1/players', function(){
		it('should get all players', function(done){
			request
				.get('/api/v1/players')
				.expect(200)
				.end(function(err, res){
					if(err) return done(err);

					res.body.results.length.should.be.above(0);
					done();
				});
		});
	});
});