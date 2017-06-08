const express = require("express");

var appDirectory = process.env.NODE_PATH;
var router = express.Router();

router.get("/index.html", function (req, res, next) {
    res.sendFile(appDirectory + "/www/resource-gantt/index.html");
});

module.exports = router;
