'use strict';
const compression = require('compression');
const express = require("express");
const morgan = require('morgan');

const app = express();
const router = express.Router();

const logger = morgan('[:date[iso]] :remote-addr(:remote-user) ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"');

const base = __dirname + '/';
const port = process.env.NODEJS_PORT || 80;

app.use(compression());
app.use(express.static('assets'));
app.use(logger);

router.get("/", function (req, res) {
    res.redirect('/resource-gantt/index.html');
});

router.get("/resource-gantt/index.html", function (req, res) {
    res.sendFile(base + "resource-gantt/index.html");
});

router.get("/data/resource-gantt-reservations.json", function (req, res) {
    res.sendFile(base + "data/resource-gantt-reservations.json");
});

app.use("/", router);

app.use("*", function (req, res) {
    res.status(404).sendFile(base + "assets/static/html/404.html");
});

app.listen(port, function () {
    console.log('Server is listening on port ' + port)
});

