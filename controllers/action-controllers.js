var Room = require('../models/room');
var Order = require('../models/order');
//var Diary = require('../models/diary');

// Dashboard
exports.index = (req, res) => {
    res.render('index', { user: req.user });
}

// Rooms
exports.rooms = (req, res) => {
    var status = (typeof req.query.status != 'undefined') ? parseInt(req.query.status) : -1;
    var queryParams = {};

    if (status != -1) { // -1 means all rooms
        queryParams.reserved = status;
    }

    Room.find(queryParams)
        .then(rooms => {
            res.render('pages/rooms', {
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

// Room info
exports.roomInfo = (req, res) => {
    Room.findOne({ _id: req.params.id })
        .then(room => {
            res.render('pages/room-info', {
                user: req.user,
                room: room,
                priceConvert: numberWithCommas
            });
        })
        .catch(err => console.log(err));
}

// Order
exports.order = (req, res) => {
    const roomID = req.body.roomID;
    const price = parseInt(req.body.price);
    const customerName = req.body.customerName;
    const customerID = req.body.customerID;
    const customerTel = req.body.customerTel;

    const start = new Date(req.body.start);
    const exp = new Date(req.body.exp);
    const numberOfDays = (exp - start) / (24 * 60 * 60 * 1000);
    const totalCost = price * numberOfDays;

    Room.findOneAndUpdate({ _id: roomID }, { reserved: true }, { new: true, useFindAndModify: false })
        .then(room => {
            var newOrder = new Order({ roomID, customerName, customerID, customerTel, start, exp, totalCost });
            newOrder.save();
            res.redirect('/room-info/' + roomID);
        })
        .catch(err => console.log(err));
}

// New room
exports.newRoom = function (req, res) {
    res.render('pages/new-room', {
        user: req.user
    });
}
// Convert number to string with commas
var numberWithCommas = function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

//<h6 style="color: aliceblue;"><%= user.name %> (<%= user.position %>)</h6>



// // The statistics by date
// exports.diaryDate = function(inputDate) {
//         var date = new Date;
//         var today = date.getDate();
//         if (date != 0) {
//             Diary.findOne(Diary.date = inputDate)
//         } else {
//             Diary.findOne(Diary.date= today)
//         }

//     }

// The statistics by month
// exports.diaryMonth = function(month){
//     var moneyRecive =0;
//     var moneySpeed =0;
//     var difference =0;
//     var date = new Date();
//     var month = date.getMonth();
//     var  a = Diary.find().where(Diary.date.getMonth).equals(month);
//     for (i =0; i < length(a); i++){

//     }

// }
// The statistics by precious
// The statistics by year