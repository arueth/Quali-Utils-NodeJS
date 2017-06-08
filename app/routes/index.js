const express = require("express");

var appDirectory = process.env.NODE_PATH;
var router = express.Router();

router.get("/", function (req, res, next) {
    res.redirect('/resource-gantt/index.html');
});

module.exports = router;
