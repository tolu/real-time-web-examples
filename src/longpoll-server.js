
var express = require('express'),
	path 	= require('path'),
	fs 	= require('fs'),
	defers = [];

var app = express();

app.use(express.bodyParser());

function renderPage (res, filename) {
	res.write(fs.readFileSync(__dirname + '/public/' + filename));
	res.end();
}

// define routes
app.get('/', function (req, res) {
	renderPage(res, 'longpoll.html');
});

app.get('/longpoll', function (req, res) {
	
	// save response in array
	defers.push(res);

	// when connection close, 
	// remove response from array
	req.on("close", function(){
		defers.splice(defers.indexOf(res),1);
	});

});

app.post('/resolve', function (req, res) {
	
	// the future has arrived, notify all those who have deferred
	console.log('pushing updates to ' + defers.length + ' clients');
	for( idx in defers ){
        defers[idx].json({ msg : req.body.msg });
        defers[idx].end();
    }
    
    // purge the deferrals
    defers = []

    res.end();
});

// start server
app.listen(2000);
console.log('Long Poll Server Listening on port 2000');

/* client side JS

(function poll() {
	$.ajax({url: "longpoll", dataType: "json", timeout: getTime()})
		.done(function (data) {
			$('body').append('got update : ' + data + '<br/>');
		})
		.always(poll);
}());

function update (msg) {
	$.ajax({url: "resolve" }).done(function(data){
		$('body').append('updated with ' + data + '<br/>');
	});
}

*/