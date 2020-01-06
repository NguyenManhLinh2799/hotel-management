var Room = require('../models/room');
//var Diary = require('../models/diary');

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

// Room info
exports.roomInfo = (req, res) => {
        res.render('pages/room-info', {
            layout: 'layout',
            user: req.user
        });
    }
    // new room
exports.newRoom = function(req, res) {
        res.render('pages/new-room', {
            layout: 'layout',
            user: req.user
        });
    }
    // Convert number to string with commas
var numberWithCommas = function(x) {
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