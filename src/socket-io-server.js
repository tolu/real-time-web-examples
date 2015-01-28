
var app = require('express')(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	fs 	= require('fs');

// start server
server.listen(5000);
console.log('Server Listening on port 5000');

// routing
app.get('/', function (req, res) {
	res.write(fs.readFileSync(__dirname + '/public/socketio.html'));
	res.end();
});

// setup socket server
io.sockets.on('connection', function (socket) {
	
	socket.emit('news', { msg: 'socket connected' });

	socket.on('server log', function (data) {
		console.log(data.msg);
	});

	socket.on('bounce back', function (data) {
		socket.emit('bounce', { msg: 'world' });
	});
	
});
