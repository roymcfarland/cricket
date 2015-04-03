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
		it('when the session token is not accepted by Parse.', function(done){
			requestLocal
				.get('/api/v1/users')
				.query('sessionToken=notarealtoken')
				.expect(500)
				.end(function(err, res){
					if(err) return done(err);

					res.body.code.should.be.exactly(101);
					done();
				});
		});
	});
});

describe('Sending a POST request to a protected route', function(){
	describe('should fail', function(){
		it('when the sessionToken is not passed in.', function(done){
			requestLocal
				.post('/api/v1/test')
				.expect(430)
				.end(done);
		});
		it('when the sessionToken is not alphanumeric.', function(done){
			requestLocal
				.post('/api/v1/test')
				.send({
					sessionToken: 'irenstdh%'
				})
				.expect(428)
				.end(function(err, res){
					if(err) return done(err);

					res.body.errors.sessionToken[0].should.be.exactly('The sessionToken field must be alphanumeric.');
					done();
				});
		});
		it('when the session token is not accepted by Parse.', function(done){
			requestLocal
				.post('/api/v1/test')
				.send({
					sessionToken: 'notarealtoken'
				})
				.expect(500)
				.end(function(err, res){
					if(err) return done(err);

					res.body.code.should.be.exactly(101);
					done();
				});
		});
	});
});