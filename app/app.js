'use strict';
const compression = require('compression');
const express = require("express");
const favicon = require('serve-favicon');
const morgan = require('morgan');
const path = require('path');

const logger = morgan(
    '[:date[iso]] ' +
    ':remote-addr(:remote-user) ' +
    '":method :url HTTP/:http-version" :status :res[content-length] :response-time ms ":referrer" ":user-agent"');

var app = express();

app.use(compression());
app.use(express.static(path.join(__dirname, 'www', 'public')));
app.use(favicon(path.join(__dirname, 'www', 'public', 'favicon.ico')));
app.use(logger);

app.use("/data", express.static(path.join(__dirname, 'www', 'data')));
app.use(express.static(path.join(__dirname, 'www', 'dist')));
app.use("*", function (req, res) {
    res.sendFile(path.join(__dirname, 'www', 'dist', 'index.html'));
});

app.use(function (err, req, res, next) {
    var status = err.status || 500;
    var message = err.message;
    var stackTrace = req.app.get('env') === 'development' ? err.stack : {};

    console.log("[ERROR] " + message + "\n" + stackTrace);

    var response =
        "<h1>" + status + "</h1>" +
        "<h2>" + message + "</h2>" +
        "<pre>" + stackTrace + "</pre>";

    res.status(status);
    res.send(response);
});

module.exports = app;
