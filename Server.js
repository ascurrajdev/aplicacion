var express = require("express");
var bodyParser = require("body-parser");
var session = require('express-session');
var cookieParser = require('cookie-parser');
const path = require('path');

var app = express();
var http = require('http').Server(app);

app.use(cookieParser());
app.use(session({secret: "$buss1nessCHO1C3S$"}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/dist'));
app.use('/static', express.static(__dirname + '/static'));

app.get('*', function(req, res, next) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 8080;

var server = http.listen(port, function () { console.log("App now running on port", port); });
