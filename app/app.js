'use strict';
require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss Z');

const PORT = 80;

var path = __dirname + '/';

var express = require("express");
var app = express();
var router = express.Router();

router.use(function (req, res, next) {
    console.log('%s %s', req.method, req.originalUrl);
    next();
});

router.get("/", function (req, res) {
    console.log('REDIRECT %s %s => /resource-gantt/index.html', req.method, req.originalUrl);
    res.redirect('/resource-gantt/index.html');
});

router.get("/resource-gantt/index.html", function (req, res) {
    res.sendFile(path + "resource-gantt/index.html");
});

router.get("/data/resource-gantt-reservations.json", function (req, res) {
    res.sendFile(path + "data/resource-gantt-reservations.json");
});

app.use(express.static('assets'));

app.use("/", router);

app.use("*", function (req, res) {
    res.status(404).sendFile(path + "assets/static/html/404.html");
});

app.listen(PORT, function () {
    console.log('Server is listening on port ' + PORT)
});