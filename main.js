var Slack = require('slack-client');

var token = 'xoxb-YOUR-TOKEN-HERE';
var autoReconnect = true;
var autoMark = true;

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex ;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		if(temporaryValue == 'lunchteam') {
			array.splice(currentIndex, 1);
		} else {
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
	}

	return array;
}

var slack = new Slack(token, autoReconnect, autoMark);

slack.on('open', function() {
	var lunchGroupOrChannel = slack.getChannelByName('sampa');

	var members = (function () {
		var usersObject = slack.users;
		var usersIds = lunchGroupOrChannel.members;
		console.log(usersObject);
		console.log(usersIds);
		var results = [];
		for (id in usersIds) {
			console.log(id);
			results.push(usersObject[usersIds[id]].name);
		}
		return results;
	})();

	console.log("Welcome to Slack. You are @" + slack.self.name + " of " + slack.team.name);

	members = shuffle(members);
	var nr_groups = 3;
	var nr_members = 4;
	var nr_number = 1;

	lunchGroupOrChannel.send('Vamos comer ae?');
	lunchGroupOrChannel.send('------------------');
	while(members.length > 0) {
		lunchGroupOrChannel.send('Team ' + nr_number);
		lunchGroupOrChannel.send(members.splice(0, Math.min(nr_members, members.length)).join(', '));
		lunchGroupOrChannel.send('------------------');
		nr_number++;
	}

});

slack.on('error', function(error) {
	return console.error("Error: " + error);
});

slack.login();