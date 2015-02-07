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

describe('sending a GET to /rules', function() {
	it('should get the rules in JSON format', function(done) {
		request
			.get('/rules')
			.expect(200)
			.end(function(err, res) {
				if(err) return done(err);

				res.body.captainChanges.should.be.exactly('unlimited');
				res.body.moneyToCreateTeam.should.be.exactly(100000);
				res.body.numberOfPlayersPerTeam.should.be.exactly(11);
				res.body.points.basedOn.should.have.length(4);
				res.body.points.bonus.BowlingEconomyRate['0.00-4.00'].should.be.exactly(15);
				res.body.points.bonus.BowlingEconomyRate['4.01-5.50'].should.be.exactly(10);
				res.body.points.bonus.BowlingEconomyRate['5.51-7.00'].should.be.exactly(0);
				res.body.points.bonus.BowlingEconomyRate['7.01-9.00'].should.be.exactly(-10);
				res.body.points.bonus.BowlingEconomyRate['9.01+'].should.be.exactly(-15);
				res.body.points.bonus.every50Runs.should.be.exactly(20);
				res.body.points.bonus.manOfTheMatch.should.be.exactly(20);
				res.body.points.coreScoring.catch.should.be.exactly(10);
				res.body.points.coreScoring.run.should.be.exactly(1);
				res.body.points.coreScoring.runOut.should.be.exactly(10);
				res.body.points.coreScoring.stump.should.be.exactly(10);
				res.body.points.coreScoring.wicketTaken.batsmanBowler.should.be.exactly(15);
				res.body.points.coreScoring.wicketTaken.batsmanNotBowler.should.be.exactly(25);
				res.body.points.trumpMultipier.should.be.exactly(2);
				res.body.points.updateSchedule.should.be.exactly('day');
				res.body.teamFormat.should.have.length(7);
				res.body.transfers.betweenPhases.should.be.exactly('unlimited');
				res.body.transfers.phase1.should.be.exactly(120);
				res.body.transfers.phase2.should.be.exactly(10);

				done();
			});
	});
});