'use strict';

var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');

const app = express();

mongoose.connect('mongodb://localhost/onlineExams');
const db = mongoose.connection;
console.log('DB Connected');
db.once('open', onDataBaseConnectionSuccess);
db.on('error', onDataBaseConnectionError);


// On DB Connection success
function onDataBaseConnectionSuccess() {
    app.use(express.json({limit: '50mb'}));
    app.use(cors());
    require('./routes')(app);
    const serv = app.listen(3000, () => {
        console.log('Listening on port 3000');
        const socket = require('socket.io')(serv, {
            cors: {
                origin: "http://localhost:4200"
            }
        });
    })
}

/*If DB connection establish failure*/
function onDataBaseConnectionError(err){
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
}