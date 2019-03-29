// app.js

var express = require('express');
var bodyParser = require('body-parser');


var app = express();

const addRoutes = require('./routes/add'); // Imports routes for the products


//	Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url = 'mongodb://localhost:27017/master';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB,{ useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname + '/public'));

app.use('',addRoutes);
var port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});
