var express = require('express'),
	path 	= require('path'),
	fs 		= require('fs');

var app = express(),
	clients = [];

app.use(express.bodyParser());

function renderPage (res, filename) {
	res.write(fs.readFileSync(__dirname + '/public/' + filename));
	res.end();
}

app.get('/', function (req, res) {
	renderPage(res, 'forever-frame.html');
});

	
app.get('/foreverframe', function (req, res) {
	clients.push(res);

	res.writeHead(200, {
		'Content-Type':'text/html;charset=utf-8', 
		'Transfer-Encoding':'chunked'}
	);
	res.write('<script> parent.onnewdata("connected douche!");</script>');
});

app.post('/resolve', function (req, res) {
	// the future has arrived
	var msg = req.body.msg,
		client;

	for( idx in clients){
		clients[idx].write('<script> parent.onnewdata("' + msg + '");</script>');
	}
	
    res.end();
});

// start server
app.listen(3000);
console.log('Forever Frame Server listening in on port 3000');