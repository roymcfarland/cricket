var supertest = require('supertest');

var requestLocal = supertest('http://localhost:3000');
var requestParse = supertest('https://api.parse.com');

describe('Creating a new league', function(){
	it('should return a 404 when the user id is not provided', function(done){
		requestLocal
			.post('/api/league')
			.expect(404)
			.end(done);
	});

	it('should return a 404 when the user id does not correspond to a user on parse', function(done) {
		requestLocal
			.post('/api/league')
			.send({
				objectId: 'notreal'
			})
			.expect(404)
			.end(done);
	});
});