var supertest = require('supertest');
var should = require('should');
var fs = require('fs');

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

describe('the rules', function() {
	it('should not have been modified', function(done) {
		fs.stat(__dirname + '/../config/rules.json', function(err, stats) {
			if(err) return done(err);

			var modifiedTime = stats.mtime.toUTCString();
			modifiedTime.should.be.exactly('Sat, 07 Feb 2015 18:48:50 GMT');
			done();
		});
	});
});