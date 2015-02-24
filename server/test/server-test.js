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

describe('sending a GET to /api/rules', function() {
	it('should get the rules in JSON format', function(done) {
		request
			.get('/api/rules')
			.expect(200)
			.end(function(err, res) {
				if(err) return done(err);

				res.body.moneyToCreateTeam.should.be.exactly(100000);
				res.body.numberOfPlayersPerTeam.should.be.exactly(11);
				res.body.teamFormat[0].batsman.should.be.exactly(6);
				res.body.teamFormat[0]['allRounders'].should.be.exactly(0);
				res.body.teamFormat[0]['wicketKeeper'].should.be.exactly(1);
				res.body.teamFormat[0].bowlers.should.be.exactly(4);
				res.body.teamFormat[1].batsman.should.be.exactly(5);
				res.body.teamFormat[1]['allRounders'].should.be.exactly(0);
				res.body.teamFormat[1]['wicketKeeper'].should.be.exactly(1);
				res.body.teamFormat[1].bowlers.should.be.exactly(5);
				res.body.teamFormat[2].batsman.should.be.exactly(5);
				res.body.teamFormat[2]['allRounders'].should.be.exactly(1);
				res.body.teamFormat[2]['wicketKeeper'].should.be.exactly(1);
				res.body.teamFormat[2].bowlers.should.be.exactly(4);
				res.body.teamFormat[3].batsman.should.be.exactly(5);
				res.body.teamFormat[3]['allRounders'].should.be.exactly(2);
				res.body.teamFormat[3]['wicketKeeper'].should.be.exactly(1);
				res.body.teamFormat[3].bowlers.should.be.exactly(3);
				res.body.teamFormat[4].batsman.should.be.exactly(4);
				res.body.teamFormat[4]['allRounders'].should.be.exactly(1);
				res.body.teamFormat[4]['wicketKeeper'].should.be.exactly(1);
				res.body.teamFormat[4].bowlers.should.be.exactly(5);
				res.body.teamFormat[5].batsman.should.be.exactly(4);
				res.body.teamFormat[5]['allRounders'].should.be.exactly(2);
				res.body.teamFormat[5]['wicketKeeper'].should.be.exactly(1);
				res.body.teamFormat[5].bowlers.should.be.exactly(4);
				res.body.teamFormat[6].batsman.should.be.exactly(4);
				res.body.teamFormat[6]['allRounders'].should.be.exactly(3);
				res.body.teamFormat[6]['wicketKeeper'].should.be.exactly(1);
				res.body.teamFormat[6].bowlers.should.be.exactly(3);
				res.body.transfers.phase1.should.be.exactly(120);
				res.body.transfers.phase2.should.be.exactly(10);
				res.body.transfers.betweenPhases.should.be.exactly('unlimited');
				res.body.captainChanges.should.be.exactly('unlimited');
				res.body.points.updateSchedule.should.be.exactly('day');
				res.body.points.basedOn[0].should.be.exactly('bowling');
				res.body.points.basedOn[1].should.be.exactly('batting');
				res.body.points.basedOn[2].should.be.exactly('fielding');
				res.body.points.basedOn[3].should.be.exactly('manOfTheMatch');
				res.body.points.trumpMultipier.should.be.exactly(2);
				res.body.points.coreScoring.run.should.be.exactly(1);
				res.body.points.coreScoring.wicketTaken.batsmanBowler.should.be.exactly(15);
				res.body.points.coreScoring.wicketTaken.batsmanNotBowler.should.be.exactly(25);
				res.body.points.coreScoring.catch.should.be.exactly(10);
				res.body.points.coreScoring.stump.should.be.exactly(10);
				res.body.points.coreScoring.runOut.should.be.exactly(10);
				res.body.points.bonus.every50Runs.should.be.exactly(20);
				res.body.points.bonus.manOfTheMatch.should.be.exactly(20);
				res.body.points.bonus.BowlingEconomyRate[0].description.should.be.exactly('Between 0.00 and 4.00 runs per over');
				res.body.points.bonus.BowlingEconomyRate[1].description.should.be.exactly('Between 4.01 and 5.50 runs per over');
				res.body.points.bonus.BowlingEconomyRate[2].description.should.be.exactly('Between 5.51 and 7.00 runs per over');
				res.body.points.bonus.BowlingEconomyRate[3].description.should.be.exactly('Between 7.01 and 9.00 runs per over');
				res.body.points.bonus.BowlingEconomyRate[4].description.should.be.exactly('9.01 runs per over and over');
				res.body.points.bonus.BowlingEconomyRate[0].value.should.be.exactly(15);
				res.body.points.bonus.BowlingEconomyRate[1].value.should.be.exactly(10);
				res.body.points.bonus.BowlingEconomyRate[2].value.should.be.exactly(0);
				res.body.points.bonus.BowlingEconomyRate[3].value.should.be.exactly(-10);
				res.body.points.bonus.BowlingEconomyRate[4].value.should.be.exactly(-15);
				res.body.points.bonus.runRate[0].description.should.be.exactly('Between 0.00 and 90.00 runs per 100 balls');
				res.body.points.bonus.runRate[1].description.should.be.exactly('Between 90.01 and 120.00 runs per 100 balls');
				res.body.points.bonus.runRate[2].description.should.be.exactly('Between 120.01 and 150.00 runs per 100 balls');
				res.body.points.bonus.runRate[3].description.should.be.exactly('Between 150.01 and 180.00 runs per 100 balls');
				res.body.points.bonus.runRate[4].description.should.be.exactly('180.01 runs per 100 balls and over');
				res.body.points.bonus.runRate[0].value.should.be.exactly(-10);
				res.body.points.bonus.runRate[1].value.should.be.exactly(0);
				res.body.points.bonus.runRate[2].value.should.be.exactly(5);
				res.body.points.bonus.runRate[3].value.should.be.exactly(10);
				res.body.points.bonus.runRate[4].value.should.be.exactly(15);
				res.body.points.bonus.dismissedForDuck['nonBowler'].should.be.exactly(-20);
				res.body.points.bonus.dismissedForDuck.bowler.should.be.exactly(-10);
				res.body.points.bonus["nonBowlerOut"].should.be.exactly(-5);
				res.body.points.bonus.bowling['threeWicketHaul'].should.be.exactly(20);
				res.body.points.bonus.bowling['fiveWicketHaul'].should.be.exactly(30);
				res.body.points.bonus.bowling.hatTrick.should.be.exactly(20);

				done();
			});
	});
});