var Room = require('../models/room');

// Dashboard
exports.index = (req, res) => {
	res.render('index', { layout: 'layout', user: req.user });
}

// Rooms
exports.rooms = (req, res) => {
	var status = (typeof req.query.status != 'undefined') ? parseInt(req.query.status) : -1;
	var queryParams = {};

	console.log(status);

	if (status != -1) { // -1 means all rooms
		queryParams.reserved = status;
	}

	console.log(queryParams);

	Room.find(queryParams)
		.then(rooms => {
			res.render('pages/rooms', {
				layout: 'layout',
				user: req.user,
				rooms: rooms,
				priceConvert: numberWithCommas,
				// Remain selection
				status: status
			});
		})
		.catch(err => console.log(err));
}

// Filter
exports.roomsFilter = (req, res) => {
	var status = parseInt(req.body.status);
	var queryStr = '';

	if (status != -1) { // -1 means all rooms
		queryStr += '?status=' + status;
	}

	res.redirect('/rooms' + queryStr);
}

// Convert number to string with commas
var numberWithCommas = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

//<h6 style="color: aliceblue;"><%= user.name %> (<%= user.position %>)</h6>