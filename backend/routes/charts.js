var express = require('express');
// const chartController = require('../controllers/chartController');
// var data = require('../mockdata/mock.json')
const data = require('../charts/index');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('\nobj:', JSON.stringify(data, null, 2));
  res.send(data);
});

// router.get('/', chartController.getAll);

module.exports = router;
