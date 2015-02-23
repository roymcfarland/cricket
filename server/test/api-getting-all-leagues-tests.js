var supertest = require('supertest');
var config = require('../config/config');

var requestLocal = supertest('http://localhost:3000');
var requestParse = supertest('https://api.parse.com');

describe('Getting all leagues owned by the user', function(){
	it('should fail if no object id is passed in', function(done){
		requestLocal
			.get('/api/leagues?owner=true')
			.expect(427)
			.end(done);
	});

	it('should fail if an empty object id is passed in', function(done){
		requestLocal
			.get('/api/leagues?owner=true&objectId=')
			.expect(427)
			.end(done);
	});
});