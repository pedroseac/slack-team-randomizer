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
	console.log("Welcome to Slack. You are @" + slack.self.name + " of " + slack.team.name);
});

slack.on('message', function(message) {
	if (message.text && message.text.search(/randomize-team/) >= 0) {
		var channel = message.text.match(/channel=["']([a-zA-Z\d]+)["']/);
		var group = message.text.match(/group=["']([a-zA-Z\d]+)["']/);
		var teamSize = message.text.match(/team-size=([a-zA-Z\d]+)/);
		var nrTeams = message.text.match(/nr-teams=([a-zA-Z\d]+)/);
		var purpose = message.text.match(/purpose=["']([a-zA-Z\d]+)["']/);

		var target = slack.getChannelGroupOrDMByID(message.channel);

		if (channel) {
			target = slack.getChannelByName(channel[1]);
		} else if (group) {
			target = slack.getGroupByName(group[1]);
		}

		if (target) {
			var members = (function () {
				var usersObject = slack.users;
				var usersIds = target.members;
				var results = [];
				for (id in usersIds) {
					if(!usersObject[usersIds[id]].deleted) results.push(usersObject[usersIds[id]].name);
				}
				return results;
			})();

			members = shuffle(members);
			// target.send('Hey! Someone requested teams?');
			console.log('Hey! Someone requested teams?');
			// if (purpose) target.send('Purpose: ', purpose);
			if (purpose) console.log('Purpose: ', purpose[1]);

			var nr_members = 4;

			if (teamSize) {
				nr_members = teamSize[1];
			} else if (nrTeams) {
				nr_members = Math.ceil(members.length / nrTeams[1]);
			}

			var i = 1;
			while(members.length > 0) {
				// target.send('Team ' + i);
				console.log('TEAM ' + i);
				// target.send(members.splice(0, Math.min(nr_members, members.length)).join(', '));
				console.log(members.splice(0, Math.min(nr_members, members.length)).join(', '));
				// target.send('------------------');
				console.log('------------------');
				i++;
			}
		}

	}
});

slack.on('error', function(error) {
	return console.error("Error: " + error);
});

slack.login();