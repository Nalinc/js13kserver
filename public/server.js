"use strict";

var socket,
	players = [];

var Player = function(nickname, startX, startY, type) {
	var nick = nickname,
		x = startX,
		y = startY,
		angle = 5,
		shipType = type,
		id;
	var getX = function() {
		return x;
	};
	var getY = function() {
		return y;
	};
	var getAngle = function() {
		return angle;
	};
	var getType = function() {
		return shipType;
	};
	var getNick = function() {
		return nick;
	};
	var setX = function(newX) {
		x = newX;
	};
	var setY = function(newY) {
		y = newY;
	};
	var setAngle = function(newAngle) {
		angle = newAngle;
	};
	var setType = function(newType) {
		shipType = newType;
	};
	return {
		getX: getX,
		getY: getY,
		getAngle: getAngle,
		getType: getType,
		getNick: getNick,
		setX: setX,
		setY: setY,
		setAngle: setAngle,
		setType: setType,
		id: id
	}
};

// Socket client has disconnected
function onClientDisconnect() {
	console.log("Player has disconnected: "+this.id);

	var removePlayer = playerById(this.id);

	// Player not found
	if (!removePlayer) {
		console.log("Player not found: "+this.id);
		return;
	};

	// Remove player from players array
	players.splice(players.indexOf(removePlayer), 1);

	// Broadcast removed player to connected socket clients
	this.broadcast.emit("remove player", {id: this.id});
};

// New player has joined
function onNewPlayer(data) {

	var shiptype = Math.floor(Math.random() * 9) + 0 ;
	// Create a new player
	var newPlayer = new Player(data.nick, data.x, data.y, data.type);
	newPlayer.id = this.id;

	// Broadcast new player to connected socket clients
	this.broadcast.emit("new player", {nick: data.nick, id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY(), angle: newPlayer.getAngle(), type: newPlayer.getType()});

	// Send existing players to the new player
	var i, existingPlayer;
	for (i = 0; i < players.length; i++) {
		existingPlayer = players[i];
		this.emit("new player", {nick: existingPlayer.getNick(), id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY(), angle: existingPlayer.getAngle(), type: existingPlayer.getType()});
	};
		
	// Add new player to the players array
	players.push(newPlayer);
};

// Player has moved
function onMovePlayer(data) {
	// Find player in array
	var movePlayer = playerById(this.id);

	// Player not found
	if (!movePlayer) {
		console.log("Player not found: "+this.id);
		return;
	};

	// Update player position
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
	movePlayer.setAngle(data.angle);
	movePlayer.setType(data.type);
	// Broadcast updated position to connected socket clients
	this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY(), angle: movePlayer.getAngle(), type: movePlayer.getType(), isFiring: data.isFiring});
};

// Player has rejoined
function onRejoin(data) {
	// Find player in array
	var rejoinedPlayer = playerById(this.id);

	// Player not found
	if (!rejoinedPlayer) {
		console.log("Player not found: "+this.id);
		return;
	};

	// Broadcast updated position to connected socket clients
	this.broadcast.emit("rejoin", {id: rejoinedPlayer.id});
};

/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < players.length; i++) {
		if (players[i].id == id)
			return players[i];
	};
	
	return false;
};

/**
 * Socket.IO on connect event
 * @param {Socket} socket
 */
module.exports = function (socket) {

	console.log("New player has connected: "+socket.id);

	// Listen for client disconnected
	socket.on("disconnect", onClientDisconnect);

	// Listen for new player message
	socket.on("new player", onNewPlayer);

	// Listen for move player message
	socket.on("move player", onMovePlayer);

	// Listen for player rejoin message
	socket.on("rejoin", onRejoin);
};