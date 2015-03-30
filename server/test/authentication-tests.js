var supertest = require('supertest');
var should = require('should');

var requestLocal = supertest('http://localhost:3000');
var requestParse = supertest('https://api.parse.com');

describe('Sending a GET request to a protected route', function(){
	describe('should fail', function(){
		it('when the session token is not passed in.', function(done){
			requestLocal
				.get('/api/v1/users')
				.expect(430)
				.end(done);
		});
		it('when the session token is not alphanumeric.', function(done){
			requestLocal
				.get('/api/v1/users')
				.query('sessionToken=asurltj#@')
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.sessionToken[0].should.be.exactly('The sessionToken field must be alphanumeric.');
					done();
				});
		});
	});
});