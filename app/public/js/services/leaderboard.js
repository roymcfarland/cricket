var leaderboard = angular.module("leaderboard", [])

leaderboard.factory("Leaderboard", function() {

	// Access scores
	var Leaderboard = Parse.Object.extend("score");
	
	// Establish query
	var query = new Parse.Query(Leaderboard);

	// Query
	query.ascending("score");
	query.find({
		sucess: function(results) {
			console.log("Successfully retrieved " + results.length + " scores.")
			for (var i = 0; i < results.length; i++) {
				var object = results[i];
				alert(object.id + " - " + object.get("username"));
			}
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
});
