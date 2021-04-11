'use strict';
const fs = require("fs");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
global.ROOTPATH = __dirname;
var app = express();

app.use(cors());

app.use(express.static(__dirname + "views"));

app.set("view engine", "ejs");

// Express TCP requests parsing
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cookieParser());

// create a write stream (in append mode) for system logger
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(logger('common', { stream: accessLogStream }))

// Route definitions
app.use('/cache', require('./app/cache'))
app.use("/console", require('./routes/console'));
app.use("/api", require("./routes/api"));
require("./routes/web")(app);;

module.exports = app;