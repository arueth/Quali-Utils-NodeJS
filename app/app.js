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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(compression());
app.use(express.static(path.join(__dirname, 'www', 'public')));
app.use(favicon(path.join(__dirname, 'www', 'public', 'favicon.ico')));
app.use(logger);

var index = require('./routes/index');
var data = require('./routes/data');
var resourceGantt = require('./routes/resource-gantt');

app.use("/", index);
app.use("/data", data);
app.use("/resource-gantt", resourceGantt);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    
    next(err);
});

app.use(function (err, req, res, next) {
    err.status = err.status || 500;
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status);
    res.render('error');
});

module.exports = app;
