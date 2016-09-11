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
exports.Player = Player;