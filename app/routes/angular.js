const express = require("express");

var appDirectory = process.env.NODE_PATH;
var router = express.Router();

router.use(express.static(appDirectory + '/www/dist'));
router.use(function (req, res) {
    res.sendFile(appDirectory + '/www/dist/index.html');
})

module.exports = router;
