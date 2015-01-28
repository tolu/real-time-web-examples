
var express = require('express'),
	path 	= require('path'),
	fs 	= require('fs'),
	clients = [];

var app = express();

app.use(express.bodyParser());

function renderPage (res, filename) {
	res.write(fs.readFileSync(__dirname + '/public/' + filename));
	res.end();
}

app.get('/', function (req, res) {
	renderPage(res, 'sse.html');
});

app.get('/stream', function (req, res) {
	var id = (new Date()).toLocaleTimeString();
	notifyOthers();

	res.writeHead(200, {
	    'Content-Type': 'text/event-stream',
	    'Cache-Control': 'no-cache',
	    'Connection': 'keep-alive'
  	});

  	constructSSE(res, id, "connected to server ("+clients.length+" other to talk to here)");

  	clients.push({ res : res, id : id });
});

app.post('/resolve', function (req, res) {
	// send msg to all connected
	pushMessage(req.body.msg);
	res.send('updates sent');
})

function notifyOthers () {
	pushMessage('someone joined!');
}

function constructSSE(res, id, data) {
  res.write('id: ' + id + '\n');
  res.write("data: " + data + '\n\n');
}

function pushMessage (message) {
	// send msg to all connected
	var client;
	for( idx in clients){
		client = clients[idx];
		constructSSE(client.res, client.id, message);
	}
}

// start server
app.listen(4000);
console.log('SSE Server Listening on port 4000');

/* Client side js

var source = new EventSource('/stream');

source.onmessage = function(e) {
	document.body.innerHTML += e.data + '<br>';
};

*/