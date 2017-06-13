const express = require("express");

var appDirectory = process.env.NODE_PATH;
var router = express.Router();

router.use(express.static(appDirectory + '/www/data'));

module.exports = router;
