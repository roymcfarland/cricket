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
				res.body.teamFormat[0]['all-rounders'].should.be.exactly(0);
				res.body.teamFormat[0]['wicket-keeper'].should.be.exactly(1);
				res.body.teamFormat[0].bowlers.should.be.exactly(4);
				res.body.teamFormat[1].batsman.should.be.exactly(5);
				res.body.teamFormat[1]['all-rounders'].should.be.exactly(0);
				res.body.teamFormat[1]['wicket-keeper'].should.be.exactly(1);
				res.body.teamFormat[1].bowlers.should.be.exactly(5);
				res.body.teamFormat[2].batsman.should.be.exactly(5);
				res.body.teamFormat[2]['all-rounders'].should.be.exactly(1);
				res.body.teamFormat[2]['wicket-keeper'].should.be.exactly(1);
				res.body.teamFormat[2].bowlers.should.be.exactly(4);
				res.body.teamFormat[3].batsman.should.be.exactly(5);
				res.body.teamFormat[3]['all-rounders'].should.be.exactly(2);
				res.body.teamFormat[3]['wicket-keeper'].should.be.exactly(1);
				res.body.teamFormat[3].bowlers.should.be.exactly(3);
				res.body.teamFormat[4].batsman.should.be.exactly(4);
				res.body.teamFormat[4]['all-rounders'].should.be.exactly(1);
				res.body.teamFormat[4]['wicket-keeper'].should.be.exactly(1);
				res.body.teamFormat[4].bowlers.should.be.exactly(5);
				res.body.teamFormat[5].batsman.should.be.exactly(4);
				res.body.teamFormat[5]['all-rounders'].should.be.exactly(2);
				res.body.teamFormat[5]['wicket-keeper'].should.be.exactly(1);
				res.body.teamFormat[5].bowlers.should.be.exactly(4);
				res.body.teamFormat[6].batsman.should.be.exactly(4);
				res.body.teamFormat[6]['all-rounders'].should.be.exactly(3);
				res.body.teamFormat[6]['wicket-keeper'].should.be.exactly(1);
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
				res.body.points.bonus.BowlingEconomyRate["0,00-4,00"].should.be.exactly(15);
				res.body.points.bonus.BowlingEconomyRate["4,01-5,50"].should.be.exactly(10);
				res.body.points.bonus.BowlingEconomyRate["5,51-7,00"].should.be.exactly(0);
				res.body.points.bonus.BowlingEconomyRate["7,01-9,00"].should.be.exactly(-10);
				res.body.points.bonus.BowlingEconomyRate["9,01+"].should.be.exactly(-15);
				res.body.points.bonus.runRate["0,00-90,00"].should.be.exactly(-10);
				res.body.points.bonus.runRate["90,01-120,00"].should.be.exactly(0);
				res.body.points.bonus.runRate["120,01-150,00"].should.be.exactly(5);
				res.body.points.bonus.runRate["150,01-180"].should.be.exactly(10);
				res.body.points.bonus.runRate["180,01+"].should.be.exactly(15);
				res.body.points.bonus.dismissedForDuck['non-bowler'].should.be.exactly(-20);
				res.body.points.bonus.dismissedForDuck.bowler.should.be.exactly(-10);
				res.body.points.bonus["non-bowler-out"].should.be.exactly(-5);
				res.body.points.bonus.bowling['3wicketHaul'].should.be.exactly(20);
				res.body.points.bonus.bowling['5wicketHaul'].should.be.exactly(30);
				res.body.points.bonus.bowling.hatTrick.should.be.exactly(20);

				done();
			});
	});
});