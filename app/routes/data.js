const express = require("express");

var appDirectory = process.env.NODE_PATH;
var router = express.Router();

router.get("/resource-gantt-reservations.json", function (req, res) {
    res.sendFile(appDirectory + "/www/data/resource-gantt-reservations.json");
});

module.exports = router;
