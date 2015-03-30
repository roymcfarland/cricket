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
	});
});