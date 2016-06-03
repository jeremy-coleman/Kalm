/**
 * InterProcessCall connector methods
 * @module adapters/ipc
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const net = require('net');
const fs = require('fs');

/* Local variables -----------------------------------------------------------*/

const _path = '/tmp/app.socket-';

/* Methods -------------------------------------------------------------------*/

/**
 * Listens for ipc connections, updates the 'listener' property of the server
 * @param {Server} server The server object
 * @param {function} callback The callback for the operation
 */
function listen(server, callback) {
	fs.unlink(_path + server.options.port, () => {
		server.listener = net.createServer(server.handleRequest.bind(server));
		server.listener.listen(_path + server.options.port, callback);
		server.listener.on('error', server.handleError.bind(server));
	});
}

/**
 * Stops the server.
 * @param {Server} server The server object
 * @param {function} callback The success callback for the operation
 */
function stop(server, callback) {
	server.listener.close(callback);
}

/**
 * Sends a message with a socket client
 * @param {Socket} socket The socket to use
 * @param {Buffer} payload The body of the request
 */
function send(socket, payload) {
	if (socket) socket.write(payload);
}

/**
 * Creates a client and adds the data listener(s) to it
 * @param {Client} client The client to create the socket for
 * @param {Socket} socket Optionnal existing socket object.
 * @returns {Socket} The created ipc socket
 */
function createSocket(client, socket) {
	if (!socket) {
		socket = net.connect(_path + client.options.port);
	}

	socket.on('data', client.handleRequest.bind(client));

	// Emit on error
	socket.on('error', client.handleError.bind(client));

	// Emit on connect
	socket.on('connect', client.handleConnect.bind(client));

	// Will auto-reconnect
	socket.on('close', client.handleDisconnect.bind(client));

	// Add timeout listener, sever connection
	socket.on('timeout', () => disconnect(client));

	// Set timeout
	//socket.setTimeout(client.options.socketTimeout);

	return socket;
}

/**
 * Attempts to disconnect the client's connection
 * @param {Client} client The client to disconnect
 */
function disconnect(client) {
	if (client.socket && client.socket.destroy) {
		client.socket.destroy();
		client.handleDisconnect();
	}
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	listen: listen,
	send: send,
	createSocket: createSocket,
	stop: stop,
	disconnect: disconnect
};