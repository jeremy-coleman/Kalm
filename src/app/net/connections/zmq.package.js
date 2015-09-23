/**
 * ZMQ connector methods
 */

/* Requires ------------------------------------------------------------------*/

var zmq = require('zmq');
var frame = require('./frame.package');

/* Local variables -----------------------------------------------------------*/

var server;

/* Methods -------------------------------------------------------------------*/

function listen(done, failure) {
	var config = K.getComponent('config');
	var request = K.getComponent('request');
	var cl = K.getComponent('console');

	cl.log('   - Starting zmq server  [ :' + config.connections.zmq.port + ' ]');

	server = zmq.socket('pull');
	server.connect('tcp://127.0.0.1:' + config.connections.zmq.port);
	server.on('message', function(body) {
		console.log(body);
		console.log(body.toString());
		request.init(_parseArgs(JSON.parse(body.toString())));
	});
	done();
}

function send(options, callback) {
	var config = K.getComponent('config');
	var socket = zmq.socket('push');
	socket.bind('tcp://' + options.hostname + ':' + options.port, function(err) {
		if (err) return callback(err);
		console.log('sending');
		socket.send(JSON.stringify(options));	
	});
	socket.on('message', function(body) {
		//Need to unbind... or else it crashes
		callback();
	});
}

function stop(callback) {
	var cl = K.getComponent('console');
	cl.warn('   - Stopping zmq server');
	
	if (server) server.close(callback);
}

function _parseArgs(req, res) {
	return frame.create({
		uid: req.uid,
		connection: 'zmq',
		reply: function(body, code) {
			req.origin.body = body;	//hack
			send(req.origin);
		},
		path: req.path,
		method: req.method,
		payload: req.body
	});
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	listen: listen,
	send: send,
	stop: stop
};