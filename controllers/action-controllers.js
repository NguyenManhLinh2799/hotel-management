var Room = require('../models/room');
var Order = require('../models/order');
//var Diary = require('../models/diary');

// Dashboard
exports.index = (req, res) => {
    Order.aggregate([ // Statistic
        {
            '$group': {
                '_id': '$start',
                'totalSales': {
                    '$sum': '$totalCost'
                }
            }
        }
    ]).sort({ '_id': 1 })
        .then(data => {
            // Update all room status by order exp
            Room.find({})
                .then(rooms => {
                    var now = new Date();
                    rooms.forEach(room => {
                        Order.findOne({ roomID: room._id, exp: { $gte: now } }) // Find order by roomID and exp
                            .then(order => {
                                if (!order) { // No result, which mean the room is ready to use
                                    room.reserved = false;
                                    room.save();
                                }
                            })
                            .catch(err => console.log(err));
                    })

                    // Render
                    res.render('index', {
                        title: '',
                        user: req.user,
                        data: data,
                        rooms: rooms,
                        priceConvert: numberWithCommas,
                        changeDateFormat: changeDateFormat
                    });
                })
                .catch(err => console.log(err));
        })
}

// Rooms
exports.rooms = (req, res) => {
    var status = (typeof req.query.status != 'undefined') ? parseInt(req.query.status) : -1;
    var error = (typeof req.query.error != 'undefined') ? req.query.error : '';
    var queryParams = {};
    var errors = [];

    if (status != -1) { // -1 means all rooms
        queryParams.reserved = status;
    }
    if (error != '') {
        errors.push({ msg: error });
    }

    Room.find(queryParams)
        .then(rooms => {
            // Update all room status by order exp
            var now = new Date();
            rooms.forEach(room => {
                Order.findOne({ roomID: room._id, exp: { $gte: now } }) // Find order by roomID and exp
                    .then(order => {
                        if (!order) { // No result, which mean the room is ready to use
                            room.reserved = false;
                            room.save();
                        }
                    })
                    .catch(err => console.log(err));
            })

            // Render
            res.render('pages/rooms', {
                title: 'Quản lý danh sách phòng',
                user: req.user,
                rooms: rooms,
                priceConvert: numberWithCommas,
                // Remain selection
                status: status,
                // Alert Errors
                errors: errors,
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

// Room info
exports.roomInfo = (req, res) => {
    var error = (typeof req.query.error != 'undefined') ? req.query.error : '';
    var errors = [];
    if (error != '') {
        errors.push({ msg: error });
    }

    Room.findOne({ _id: req.params.id })
        .then(room => {
            var now = new Date();
            Order.findOne({ roomID: room._id, exp: { $gte: now } }) // Find order by roomID and exp
                .then(order => {
                    res.render('pages/room-info', {
                        title: 'Thông tin phòng ' + room.roomID,
                        user: req.user,
                        room: room,
                        order: order,
                        priceConvert: numberWithCommas,
                        changeDateFormat: changeDateFormat,
                        // Alert Errors
                        errors: errors
                    });
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
}

// Order
exports.order = (req, res) => {
    const roomID = req.query.id;
    const price = parseInt(req.query.price);
    const customerName = req.body.customerName;
    const customerID = req.body.customerID;
    const customerTel = req.body.customerTel;

    const start = new Date(req.body.start);
    const exp = new Date(req.body.exp);
    const numberOfDays = (exp - start) / (24 * 60 * 60 * 1000);
    const totalCost = price * numberOfDays;

    Room.findOne({ _id: roomID })
        .then(room => {
            if (exp.getTime() <= start.getTime()) {
                res.redirect('/room-info/' + room._id + '?error=Ngày%20kết%20thúc%20phải%20lớn%20hơn%20ngày%20đặt%20phòng');
            } else {
                var newOrder = new Order({ roomID, customerName, customerID, customerTel, start, exp, totalCost });
                newOrder.save();
                room.reserved = true;
                room.save();

                res.redirect('/room-info/' + roomID);
            }
        })
        .catch(err => console.log(err));
}

// New room
exports.newRoom = (req, res) => {
    const { roomID, price, imgSrc } = req.body;

    if (price <= 0) {
        res.redirect('/rooms?error=Giá%20phòng%20phải%20là%20số%20dương');
        return;
    }

    Room.findOne({ roomID: roomID })
        .then(room => {
            if (room) {
                res.redirect('/rooms?error=Số%20phòng%20đã%20tồn%20tại');
            } else {
                const newRoom = new Room({ roomID, price, imgSrc });
                newRoom.save();
                res.redirect('/rooms');
            }
        })
        .catch(err => console.log(err));
}

// Delete room
exports.deleteRoom = (req, res) => {
    Room.deleteOne({ _id: req.params.id })
        .then(result => {
            res.redirect('/rooms');
        })
        .catch(err => console.log(err));
}

// Update room
exports.updateRoom = (req, res) => {
    const newID = req.body.roomID;
    const newPrice = req.body.price;
    const newImgSrc = req.body.imgSrc;

    if (newPrice <= 0) {
        res.redirect('/room-info/' + req.params.id + '?error=Giá%20phòng%20phải%20là%20số%20dương');
        return;
    }

    Room.findOne({ roomID: newID, _id: { $ne: req.params.id } }) // Find whether a room with newID existed (except itself)
        .then(result => {
            if (result) {
                res.redirect('/room-info/' + req.params.id + '?error=Số%20phòng%20đã%20tồn%20tại');
            } else {
                Room.findOne({ _id: req.params.id })
                    .then(room => {
                        room.roomID = newID;
                        room.price = parseInt(newPrice);
                        room.imgSrc = newImgSrc;
                        room.save();

                        res.redirect('/room-info/' + room._id);
                    })
                    .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
}

// Checkout
exports.checkout = (req, res) => {
    Room.findOne({ _id: req.params.id })
        .then(room => {
            var now = new Date();
            Order.findOne({ roomID: room._id, exp: { $gte: now } }) // Find order by roomID and exp
                .then(order => {
                    room.reserved = false;
                    room.save();
                    order.exp = now;
                    order.save();

                    res.redirect('/room-info/' + room._id);
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
}

// Update order
exports.updateOrder = (req, res) => {
    const roomID = req.query.id;
    const price = parseInt(req.query.price);
    const customerName = req.body.customerName;
    const customerID = req.body.customerID;
    const customerTel = req.body.customerTel;

    const start = new Date(req.body.start);
    const exp = new Date(req.body.exp);
    const numberOfDays = (exp - start) / (24 * 60 * 60 * 1000);
    const totalCost = price * numberOfDays;

    var now = new Date();
    Order.findOne({ roomID: roomID, exp: { $gte: now } })
        .then(order => {
            order.customerName = customerName;
            order.customerID = customerID;
            order.customerTel = customerTel;
            order.start = start;
            order.exp = exp;
            order.totalCost = totalCost;
            order.save();

            res.redirect('/room-info/' + roomID);
        })
        .catch(err => console.log(err));
}

// Search
exports.search = (req, res) => {
    res.redirect('/search?key=' + req.body.key);
}
exports.searchResult = (req, res) => {
    var key = req.query.key;

    Room.find({ roomID: new RegExp(key, "i") })
        .then(rooms => {
            res.render('pages/search', {
                title: 'Kết quả tìm kiếm',
                user: req.user,
                rooms: rooms,
                key: key,
                priceConvert: numberWithCommas
            })
        })
        .catch(err => console.log(err));
}

// Statistic
exports.statistic = (req, res) => {
    Order.aggregate([ // Group by date and count totalSales
        {
            '$group': {
                '_id': '$start',
                'totalSales': {
                    '$sum': '$totalCost'
                }
            }
        }
    ]).sort({ '_id': 1 })
        .then(data => {
            res.render('pages/statistic', {
                title: 'Thống kê',
                user: req.user,
                data: data,
                changeDateFormat: changeDateFormat,
                priceConvert: numberWithCommas
            })
        })
        .catch(err => console.log(err));
}

// Functions
// Convert number to string with commas
var numberWithCommas = function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Change date format
var changeDateFormat = function (date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
}

//<h6 style="color: aliceblue;"><%= user.name %> (<%= user.position %>)</h6>
