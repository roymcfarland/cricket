var supertest = require('supertest');
var should = require('should');

var request = supertest('http://localhost:3000');


describe('Sending a GET to /', function() {
	it('should result in the index page', function(done) {
		request
			.get('/')
			.expect(200)
			.end(function(err, res) {
				if(err) return done(err);

				done();
			});
	});
});