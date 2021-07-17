var express = require('express');
var data = require('../mockdata/mock.json')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(data);
});

module.exports = router;
