
var express = require('express'),
	path 	= require('path'),
	fs 		= require('fs');

var app = express(),
	lastUpdateTime,
	theLatestAndGreatest;

app.use(express.bodyParser());

function renderPage (res, filename) {
	res.write(fs.readFileSync(__dirname + '/public/' + filename));
	res.end();
}

app.get('/', function (req, res) {
	renderPage(res, 'poll.html');
});

app.get('/poll', function (req, res) {
	var clientslastupdate = req.query.time;
	
	if(timeIsRightToSendBackData(clientslastupdate)){
		res.json({ text : theLatestAndGreatest, time : lastUpdateTime });
	} 
	
	res.end();
});

app.post('/resolve', function (req, res) {
	// the future has arrived

	theLatestAndGreatest = req.body.msg;
	lastUpdateTime = (new Date()).getTime();

	console.log('data updated to : ' + theLatestAndGreatest);

    res.end();
});

function timeIsRightToSendBackData (lastUpdated) {
	if(!!lastUpdated && !!lastUpdateTime)
		return lastUpdated < lastUpdateTime;
	return !!theLatestAndGreatest;
}

// start server
app.listen(1000);
console.log('Poll Server Listening on port 1000');

/* Client side js

// poll 1 - set interval
function onPollComplete (data) {
	// update something
	$('body').append('client polls : ' + data.polls + '<br/>');
}

setInterval(function () {
	$.ajax({url: "poll", dataType: "json"}).done(onPollComplete);
}, 3000);


// poll 2 - set timeout
(function poll() {
	setTimeout(function(){
		$.ajax({url: "poll", dataType: "json"}).done(function (data) {
			$('body').append('client polls : ' + data.polls + '<br/>');
			poll();
		});
	}, 3000)
}());

*/